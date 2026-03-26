import { describe, expect, test } from 'vite-plus/test';
import path from 'node:path';
import { clankgsterConfigSchema } from '../configs/clankgster-config.schema.js';
import { syncContentPipeline } from './sync-content-pipeline.js';
import type { SyncTransformGlobalContext } from './sync-transform-hooks.js';

function makeGlobalContext(
  overrides: Partial<SyncTransformGlobalContext> = {}
): SyncTransformGlobalContext {
  const repoRoot = '/repo';
  const resolvedConfig = clankgsterConfigSchema.config.parse({
    hooks: overrides.resolvedConfig?.hooks ?? {},
  });
  return {
    agentName: 'cursor',
    behaviorName: 'PluginsDirectorySyncPreset',
    destinationFileAbsolutePath: '/repo/.cursor/rules/foo/rule.mdc',
    destinationFileRelativePath: '.cursor/rules/foo/rule.mdc',
    outputRoot: repoRoot,
    repoRoot,
    resolvedConfig,
    sourceFileAbsolutePath: '/repo/.clank/plugins/foo/rules/rule.md',
    sourceFileRelativePath: '.clank/plugins/foo/rules/rule.md',
    sourceKind: 'rule',
    syncTimestampIso: '2026-03-25T00:00:00.000Z',
    ...overrides,
  };
}

describe('syncContentPipeline', () => {
  test('returns original contents in symlink mode', () => {
    const output = syncContentPipeline.process({
      artifactMode: 'symlink',
      contents: 'hello',
      globalContext: makeGlobalContext(),
    });
    expect(output).toBe('hello');
  });

  test('rewrites relative markdown links against destination file path', () => {
    const output = syncContentPipeline.process({
      artifactMode: 'copy',
      contents: '[docs](../references/README.md)',
      globalContext: makeGlobalContext(),
    });
    expect(output).toContain('../../../.clank/plugins/foo/references/README.md');
  });

  test('resolves built-in template variables and trims whitespace', () => {
    const output = syncContentPipeline.process({
      artifactMode: 'copy',
      contents:
        'a=[[[clankgster_agent_name]]], b=[[[ clankgster_time ]]], c=[[[       clankgster_agent_name]]]',
      globalContext: makeGlobalContext(),
    });
    expect(output).toContain('a=cursor');
    expect(output).toContain('b=2026-03-25T00:00:00.000Z');
    expect(output).toContain('c=cursor');
  });

  test('leaves unknown template variables unchanged by default', () => {
    const output = syncContentPipeline.process({
      artifactMode: 'copy',
      contents: '[[[ my_custom_local_var ]]]',
      globalContext: makeGlobalContext(),
    });
    expect(output).toContain('[[[ my_custom_local_var ]]]');
  });

  test('applies xml hook outside fenced code blocks only', () => {
    const context = makeGlobalContext();
    context.resolvedConfig.hooks.onXmlTransform = (payload) => ({
      ...payload,
      innerContent: payload.innerContent.toUpperCase(),
    });
    const output = syncContentPipeline.process({
      artifactMode: 'copy',
      contents: '<thinking phase="a">hello</thinking>\n\n```md\n<thinking>skip</thinking>\n```',
      globalContext: context,
    });
    expect(output).toContain('<thinking phase="a">HELLO</thinking>');
    expect(output).toContain('<thinking>skip</thinking>');
  });

  test('validates hook payload shape via zod', () => {
    const context = makeGlobalContext();
    context.resolvedConfig.hooks.onLinkTransform = () => ({ linkUrl: 1 }) as unknown as never;
    expect(() =>
      syncContentPipeline.process({
        artifactMode: 'copy',
        contents: '[x](./x.md)',
        globalContext: context,
      })
    ).toThrow(/onLinkTransform returned invalid payload/);
  });

  test('default link rewrite keeps anchors and absolute urls unchanged', () => {
    const output = syncContentPipeline.process({
      artifactMode: 'copy',
      contents: '[a](#head) [b](https://example.com/x) [c](mailto:test@example.com)',
      globalContext: makeGlobalContext({
        destinationFileAbsolutePath: path.join('/repo', '.cursor', 'rules', 'foo', 'bar.mdc'),
      }),
    });
    expect(output).toContain('[a](#head)');
    expect(output).toContain('[b](https://example.com/x)');
    expect(output).toContain('[c](mailto:test@example.com)');
  });
});
