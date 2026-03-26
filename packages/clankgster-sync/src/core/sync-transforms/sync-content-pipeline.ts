import { toString } from 'mdast-util-to-string';
import path from 'node:path';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import type { Link, Root, Text } from 'mdast';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { syncContentPipelineConfig } from './sync-content-pipeline.config.js';
import { syncTransformHooks, type SyncTransformGlobalContext } from './sync-transform-hooks.js';

/** Input for one copy-mode markdown content processing call. */
export interface SyncContentPipelineInput {
  artifactMode: 'copy' | 'symlink';
  contents: string;
  globalContext: SyncTransformGlobalContext;
}

function parseLinkUrlParts(linkUrl: string): { basePath: string; suffix: string } {
  const match = /^([^?#]*)([?#].*)?$/.exec(linkUrl);
  return {
    basePath: match?.[1] ?? linkUrl,
    suffix: match?.[2] ?? '',
  };
}

function createMarkdownProcessor() {
  return unified().use(remarkParse).use(remarkFrontmatter, ['yaml']).use(remarkStringify);
}

function restoreEscapedTemplateTokens(markdown: string): string {
  return markdown.replace(/\\\[\\\[\\\[([\s\S]*?)]]]/g, (_match, inner) => {
    const restoredInner = String(inner).replace(/\\_/g, '_').replace(/\\\]/g, ']');
    return `[[[${restoredInner}]]]`;
  });
}

/** Markdown parse/transform/stringify pipeline used for copy-mode file syncing. */
export const syncContentPipeline = {
  /** Returns built-in replacement for recognized template variable names. */
  resolveBuiltInTemplateValue(
    variableName: string,
    globalContext: SyncTransformGlobalContext
  ): string | null {
    if (variableName === 'clankgster_time') return globalContext.syncTimestampIso;
    if (variableName === 'clankgster_agent_name') return globalContext.agentName;
    return null;
  },

  /** Computes default link output payload before optional hook invocation. */
  defaultLinkPayload(
    rawLinkName: string,
    rawLinkUrl: string,
    globalContext: SyncTransformGlobalContext
  ): { linkName: string; linkUrl: string } {
    if (syncContentPipelineConfig.isNonRewritableLinkUrl(rawLinkUrl)) {
      return {
        linkName: rawLinkName,
        linkUrl: rawLinkUrl,
      };
    }
    const parsed = parseLinkUrlParts(rawLinkUrl);
    const basePath = parsed.basePath.trim();
    if (basePath.length === 0 || path.isAbsolute(basePath)) {
      return {
        linkName: rawLinkName,
        linkUrl: rawLinkUrl,
      };
    }
    const sourceDir = path.dirname(globalContext.sourceFileAbsolutePath);
    const destinationDir = path.dirname(globalContext.destinationFileAbsolutePath);
    const resolvedTarget = path.resolve(sourceDir, basePath);
    const repoRootResolved = path.resolve(globalContext.repoRoot);
    if (!resolvedTarget.startsWith(repoRootResolved)) {
      return {
        linkName: rawLinkName,
        linkUrl: rawLinkUrl,
      };
    }
    const rewritten = path.relative(destinationDir, resolvedTarget).replace(/\\/g, '/');
    return {
      linkName: rawLinkName,
      linkUrl: `${rewritten}${parsed.suffix}`,
    };
  },

  /** Applies link and template-variable transforms on markdown AST nodes. */
  transformMarkdownAst(
    tree: Root,
    fileContents: string,
    globalContext: SyncTransformGlobalContext
  ): void {
    const hooks = globalContext.resolvedConfig.hooks;
    visit(tree, 'link', (node) => {
      const linkNode = node as Link;
      const defaultPayload = this.defaultLinkPayload(
        toString(linkNode),
        linkNode.url,
        globalContext
      );
      const nextPayload = hooks.onLinkTransform?.(defaultPayload, { fileContents }, globalContext);
      const parsed = syncTransformHooks.linkPayloadSchema.safeParse(nextPayload ?? defaultPayload);
      if (!parsed.success) {
        throw new Error(`onLinkTransform returned invalid payload: ${parsed.error.message}`);
      }
      linkNode.url = parsed.data.linkUrl;
    });
    visit(tree, 'text', (node) => {
      const textNode = node as Text;
      const regex = new RegExp(syncContentPipelineConfig.templateVariableRegex.source, 'g');
      textNode.value = textNode.value.replace(
        regex,
        (_fullMatch: string, variableSource: string) => {
          const variableName = String(variableSource).trim();
          const defaultPayload = {
            replacement: this.resolveBuiltInTemplateValue(variableName, globalContext),
            variableName,
          };
          const nextPayload = hooks.onTemplateVariable?.(
            defaultPayload,
            { fileContents },
            globalContext
          );
          const parsed = syncTransformHooks.templateVariablePayloadSchema.safeParse(
            nextPayload ?? defaultPayload
          );
          if (!parsed.success) {
            throw new Error(`onTemplateVariable returned invalid payload: ${parsed.error.message}`);
          }
          return parsed.data.replacement ?? `[[[${variableSource}]]]`;
        }
      );
    });
  },

  /** Applies optional XML-like tag transforms on markdown string segments outside fenced code blocks. */
  transformXmlSegments(markdown: string, globalContext: SyncTransformGlobalContext): string {
    const hook = globalContext.resolvedConfig.hooks.onXmlTransform;
    if (hook == null) return markdown;
    return syncContentPipelineConfig
      .splitByCodeFences(markdown)
      .map((segment) => {
        if (segment.isCodeFence) return segment.value;
        const regex = new RegExp(syncContentPipelineConfig.xmlTagRegex.source, 'g');
        return segment.value.replace(
          regex,
          (_match, tagName: string, attrsSource: string | undefined, innerContent: string) => {
            const attributes = syncContentPipelineConfig.parseXmlAttributes(attrsSource ?? '');
            const defaultPayload = {
              attributes,
              innerContent,
              tagName,
            };
            const nextPayload = hook(defaultPayload, { fileContents: markdown }, globalContext);
            const parsed = syncTransformHooks.xmlPayloadSchema.safeParse(nextPayload);
            if (!parsed.success) {
              throw new Error(`onXmlTransform returned invalid payload: ${parsed.error.message}`);
            }
            const attrs = syncContentPipelineConfig.stringifyXmlAttributes(parsed.data.attributes);
            return `<${parsed.data.tagName}${attrs}>${parsed.data.innerContent}</${parsed.data.tagName}>`;
          }
        );
      })
      .join('');
  },

  /** Processes markdown content in copy mode; returns original text for symlink mode. */
  process(input: SyncContentPipelineInput): string {
    if (input.artifactMode === 'symlink') return input.contents;
    const processor = createMarkdownProcessor();
    const tree = processor.parse(input.contents) as Root;
    this.transformMarkdownAst(tree, input.contents, input.globalContext);
    const rendered = restoreEscapedTemplateTokens(String(processor.stringify(tree)));
    return this.transformXmlSegments(rendered, input.globalContext);
  },
};
