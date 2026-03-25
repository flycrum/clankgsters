import { describe, expect, test } from 'vite-plus/test';
import { agentPresetConfigs } from './agent-preset-configs.js';

describe('agentPresetConfigs', () => {
  test('resolve uses built-in preset for known agents', () => {
    expect(agentPresetConfigs.resolve('claude').CONSTANTS.AGENT_NAME).toBe('claude');
  });

  test('resolve builds fallback for safe slug agent names', () => {
    const preset = agentPresetConfigs.resolve('superagent');
    expect(preset.CONSTANTS.PLUGINS_DIRECTORY_TARGET_ROOT).toBe('.superagent');
  });

  test('resolve throws before path construction when fallback agentName is unsafe', () => {
    expect(() => agentPresetConfigs.resolve('a/b')).toThrow(
      /Invalid agentName for fallback preset/
    );
    expect(() => agentPresetConfigs.resolve('..')).toThrow(/Invalid agentName for fallback preset/);
  });
});
