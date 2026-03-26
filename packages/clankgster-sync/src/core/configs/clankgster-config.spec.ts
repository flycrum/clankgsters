import { describe, expect, test } from 'vite-plus/test';
import { clankgsterIdentity } from '../../common/clankgster-identity.js';
import { clankgsterConfig } from './clankgster-config.js';

describe('clankgsterConfig', () => {
  test('normalizes expressive agents map with preset boolean and custom entries', () => {
    const config = clankgsterConfig.define({
      agents: {
        claude: true,
        custom: {
          yoyo: clankgsterConfig.defineAgent({
            behaviors: ['SkillsDirectorySyncPreset'],
            enabled: true,
          }),
        },
      },
      sourceDefaults: {
        markdownContextFileName: 'YOYO.md',
        sourceDir: '.yoyo',
      },
    });
    expect(config.agents?.claude?.enabled).toBe(true);
    expect(config.agents?.yoyo?.behaviors[0]?.behaviorName).toBe('SkillsDirectorySyncPreset');
    expect(config.sourceDefaults?.sourceDir).toBe('.yoyo');
    expect(config.sourceDefaults?.markdownContextFileName).toBe('YOYO.md');
    expect(config.sourceDefaults?.localMarketplaceName).toBe(
      clankgsterIdentity.LOCAL_MARKETPLACE_NAME
    );
  });

  test('allows overriding localMarketplaceName in sourceDefaults', () => {
    const config = clankgsterConfig.define({
      sourceDefaults: {
        localMarketplaceName: 'my-market',
      },
    });
    expect(config.sourceDefaults?.localMarketplaceName).toBe('my-market');
  });

  test('supports POC-style syncBehaviorPresets booleans in defineAgent', () => {
    const config = clankgsterConfig.define({
      agents: {
        custom: {
          superagent: clankgsterConfig.defineAgent({
            name: 'superagent',
            syncBehaviorPresets: {
              AgentMarketplaceJsonSyncPreset: true,
            },
          }),
        },
      },
    });
    expect(config.agents?.superagent?.behaviors[0]?.behaviorName).toBe(
      'AgentMarketplaceJsonSyncPreset'
    );
  });

  test('applies sync defaults for artifact mode and read-only output', () => {
    const config = clankgsterConfig.define({});
    expect(config.artifactMode).toBe('copy');
    expect(config.syncOutputReadOnly).toBe(false);
  });

  test('preserves hooks callbacks and explicit artifact mode', () => {
    const onTemplateVariable = (
      payload: { replacement: string | null; variableName: string },
      _hookContext: unknown,
      _globalContext: unknown
    ) => payload;
    const config = clankgsterConfig.define({
      artifactMode: 'symlink',
      hooks: {
        onTemplateVariable,
      },
    });
    expect(config.artifactMode).toBe('symlink');
    expect(config.hooks?.onTemplateVariable).toBe(onTemplateVariable);
  });
});
