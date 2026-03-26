import { monoBaseFormatConfig } from '@clankgster/vite-plus-config/mono-base-format-config';
import { monoBaseLintConfig } from '@clankgster/vite-plus-config/mono-base-lint-config';
import { monoBaseVitestNodeConfig } from '@clankgster/vite-plus-config/mono-base-vitest-node-config';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  ...monoBaseVitestNodeConfig,
  test: {
    ...monoBaseVitestNodeConfig.test,
    /**
     * Repo-root-only specs (not `packages/**`). `*.spec.ts` covers normal names; `.*.spec.ts` covers dot-prefixed
     * files (e.g. contract tests next to `.oxlintrc.jsonc`). The root is not a pnpm workspace package, so
     * `pnpm test` runs `vp run -r test` for packages then `vp run -w test-root` (`vp test` here) — see root `package.json`.
     */
    include: ['*.spec.ts', '.*.spec.ts'],
  },
  lint: monoBaseLintConfig,
  fmt: monoBaseFormatConfig,
});
