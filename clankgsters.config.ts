import { clankgstersConfig } from './packages/clankgsters-sync/config/index.js';

/** Team-shared tier-1 sync defaults loaded before local overrides; keep deterministic and free of machine-specific paths. */
const clankgsters = clankgstersConfig.define({
  loggingEnabled: false,
  agents: {
    claude: true,
    cursor: true,
    codex: true,
    // custom: {
    //   superagent: clankgstersConfig.defineAgent({
    //     name: "superagent",
    //     syncBehaviorPresets: {
    //       MarketplaceJsonSyncPreset: true,
    //     },
    //   }),
    // },
  },
  excluded: ['packages/clankgsters-sync-e2e/sandboxes', 'dist', '.git', '.next', 'node_modules'],
});

export default clankgsters;
