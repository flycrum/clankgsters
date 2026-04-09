import { clankgsterConfig } from './packages/clankgster-sync/src/index.js';

/** Team-shared tier-1 sync defaults loaded before local overrides; keep deterministic and free of machine-specific paths. */
const clankgster = clankgsterConfig.define({
  agents: {
    claude: true,
    cursor: true,
    codex: true,
    custom: {
      superagent: clankgsterConfig.defineAgent({
        name: 'superagent',
        syncBehaviorPresets: {
          AgentMarketplaceJsonSyncPreset: true,
        },
      }),
    },
  },
  excluded: ['packages/clankgster-sync-e2e/sandboxes', 'dist', '.git', '.next', 'node_modules'],
  // hooks: {
  //   onLinkTransform: (payload, hookContext, globalContext) => {
  //     console.log('--------------------------------');
  //     console.log('onLinkTransform', payload, hookContext, globalContext);
  //     console.log('--------------------------------');
  //     return payload;
  //   },
  // },
  loggingEnabled: false,
});

export default clankgster;
