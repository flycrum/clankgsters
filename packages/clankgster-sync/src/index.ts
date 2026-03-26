/**
 * Public API surface for `@clankgster/sync`: re-exports consumed by the monorepo, published `dist/index.mjs` (via `vp pack src/index.ts`), and npm consumers.
 * Prefer `import { … } from '@clankgster/sync'` once the package is built; repo-local tooling may import this file by path (`packages/clankgster-sync/src/index.js`).
 */
export { clankgsterIdentity } from './common/clankgster-identity.js';
export { clankgsterConfig } from './core/configs/clankgster-config.js';
export { clankgsterConfigDefaults } from './core/configs/clankgster-config.defaults.js';
export { clankgsterConfigResolver } from './core/configs/config-resolver.js';
export { clankgsterConfigSchema } from './core/configs/clankgster-config.schema.js';
export type { ClankgsterBehaviorEntryInput } from './core/configs/clankgster-config.js';
export type {
  ClankgsterAgentConfig,
  ClankgsterBehaviorConfig,
  ClankgsterConfig,
  ClankgsterSourceDefaultsConfig,
} from './core/configs/clankgster-config.schema.js';
