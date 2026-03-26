import { z } from 'zod';
import type { ClankgsterConfig } from '../configs/clankgster-config.schema.js';

/** Sync artifact strategy for generated outputs. */
export type SyncArtifactMode = 'copy' | 'symlink';

/** Shared context passed as the third argument to every transform hook. */
export interface SyncTransformGlobalContext {
  agentName: string;
  behaviorName: string;
  destinationFileAbsolutePath: string;
  destinationFileRelativePath: string;
  outputRoot: string;
  pluginName?: string;
  repoRoot: string;
  resolvedConfig: ClankgsterConfig;
  sourceFileAbsolutePath: string;
  sourceFileRelativePath: string;
  sourceKind: 'command' | 'markdownContextFile' | 'plugin' | 'rule' | 'skill' | 'unknown';
  syncTimestampIso: string;
}

/** Hook-specific context for markdown link transforms. */
export interface LinkTransformHookContext {
  fileContents: string;
}

/** Link payload shape received/returned by `onLinkTransform`. */
export interface LinkTransformPayload {
  linkName: string;
  linkUrl: string;
}

/** Hook-specific context for XML-like tag transforms. */
export interface XmlTransformHookContext {
  fileContents: string;
}

/** XML payload shape received/returned by `onXmlTransform`. */
export interface XmlTransformPayload {
  attributes: Record<string, string>;
  innerContent: string;
  tagName: string;
}

/** Hook-specific context for template variable transforms. */
export interface TemplateVariableTransformHookContext {
  fileContents: string;
}

/** Template payload shape received/returned by `onTemplateVariable`. */
export interface TemplateVariableTransformPayload {
  replacement: string | null;
  variableName: string;
}

/** Signature for `onLinkTransform` hooks configured by consumers. */
export type ClankgsterOnLinkTransformHook = (
  payload: LinkTransformPayload,
  hookContext: LinkTransformHookContext,
  globalContext: SyncTransformGlobalContext
) => LinkTransformPayload;

/** Signature for `onXmlTransform` hooks configured by consumers. */
export type ClankgsterOnXmlTransformHook = (
  payload: XmlTransformPayload,
  hookContext: XmlTransformHookContext,
  globalContext: SyncTransformGlobalContext
) => XmlTransformPayload;

/** Signature for `onTemplateVariable` hooks configured by consumers. */
export type ClankgsterOnTemplateVariableTransformHook = (
  payload: TemplateVariableTransformPayload,
  hookContext: TemplateVariableTransformHookContext,
  globalContext: SyncTransformGlobalContext
) => TemplateVariableTransformPayload;

/** Consumer-configurable sync transform callbacks. */
export interface ClankgsterSyncHooks {
  onLinkTransform?: ClankgsterOnLinkTransformHook;
  onTemplateVariable?: ClankgsterOnTemplateVariableTransformHook;
  onXmlTransform?: ClankgsterOnXmlTransformHook;
}

function makeFunctionHookSchema<T>() {
  return z.custom<T>((value) => value == null || typeof value === 'function');
}

/** Shared runtime helpers and Zod payload contracts for transform hooks. */
export const syncTransformHooks = {
  linkPayloadSchema: z.object({
    linkName: z.string(),
    linkUrl: z.string(),
  }),
  templateVariablePayloadSchema: z.object({
    replacement: z.string().nullable(),
    variableName: z.string(),
  }),
  xmlPayloadSchema: z.object({
    tagName: z.string(),
    attributes: z.record(z.string(), z.string()),
    innerContent: z.string(),
  }),
  hooksSchema: z
    .object({
      onLinkTransform: makeFunctionHookSchema<ClankgsterOnLinkTransformHook>().optional(),
      onXmlTransform: makeFunctionHookSchema<ClankgsterOnXmlTransformHook>().optional(),
      onTemplateVariable:
        makeFunctionHookSchema<ClankgsterOnTemplateVariableTransformHook>().optional(),
    })
    .optional()
    .default({}),
};
