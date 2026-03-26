/**
 * Public API surface for `@clankgster/sync`: re-exports consumed by the monorepo, published `dist/index.mjs` (via `vp pack exports/index.ts`), and npm consumers.
 * Prefer `import { … } from '@clankgster/sync'` once the package is built; repo-local tooling may import this file by path (`packages/clankgster-sync/exports/index.js`).
 */
export { clankgsterIdentity } from '../src/common/clankgster-identity.js';
export { clankgsterConfigDefaults } from '../src/core/configs/clankgster-config.defaults.js';
export { clankgsterConfig } from '../src/core/configs/clankgster-config.js';
export type { ClankgsterBehaviorEntryInput } from '../src/core/configs/clankgster-config.js';
export { clankgsterConfigSchema } from '../src/core/configs/clankgster-config.schema.js';
export type {
  ClankgsterAgentConfig,
  ClankgsterBehaviorConfig,
  ClankgsterConfig,
  ClankgsterSourceDefaultsConfig,
} from '../src/core/configs/clankgster-config.schema.js';
export { clankgsterConfigResolver } from '../src/core/configs/config-resolver.js';
