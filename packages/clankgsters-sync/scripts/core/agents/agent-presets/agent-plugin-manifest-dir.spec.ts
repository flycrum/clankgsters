import { describe, expect, test } from 'vite-plus/test';
import { agentPluginManifestDir } from './agent-plugin-manifest-dir.js';

describe('agentPluginManifestDir', () => {
  test('resolve returns configured plugin manifest dir when provided', () => {
    expect(agentPluginManifestDir.resolve('claude', '.claude-plugin')).toBe('.claude-plugin');
    expect(agentPluginManifestDir.resolve('cursor', '.cursor-plugin')).toBe('.cursor-plugin');
  });

  test('resolve returns null when configuration explicitly disables plugin manifests', () => {
    expect(agentPluginManifestDir.resolve('codex', null)).toBeNull();
  });

  test('resolve builds fallback for safe slug agent names when value is undefined', () => {
    expect(agentPluginManifestDir.resolve('superagent', undefined)).toBe('.superagent-plugin');
  });

  test('resolve throws before path construction when fallback agentName is unsafe', () => {
    expect(() => agentPluginManifestDir.resolve('a/b', undefined)).toThrow(
      /Invalid agentName for plugin manifest dir fallback/
    );
    expect(() => agentPluginManifestDir.resolve('..', undefined)).toThrow(
      /Invalid agentName for plugin manifest dir fallback/
    );
  });
});
