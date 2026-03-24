import { describe, expect, test } from 'vite-plus/test';
import { clankgstersIdentity } from '../../common/clankgsters-identity.js';
import { clankgstersConfig } from './clankgsters-config.js';

describe('clankgstersConfig', () => {
  test('normalizes expressive agents map with preset boolean and custom entries', () => {
    const config = clankgstersConfig.define({
      agents: {
        claude: true,
        custom: {
          yoyo: clankgstersConfig.defineAgent({
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
      clankgstersIdentity.LOCAL_MARKETPLACE_NAME
    );
  });

  test('allows overriding localMarketplaceName in sourceDefaults', () => {
    const config = clankgstersConfig.define({
      sourceDefaults: {
        localMarketplaceName: 'my-market',
      },
    });
    expect(config.sourceDefaults?.localMarketplaceName).toBe('my-market');
  });

  test('supports POC-style syncBehaviorPresets booleans in defineAgent', () => {
    const config = clankgstersConfig.define({
      agents: {
        custom: {
          superagent: clankgstersConfig.defineAgent({
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
});
