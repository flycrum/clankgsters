import { npmPackFilesToLintGlobs } from '@clankgster/vite-plus-config/common/npm-pack-files-to-lint-globs';
import { monoBaseFormatConfig } from '@clankgster/vite-plus-config/mono-base-format-config';
import { monoBaseLintConfig } from '@clankgster/vite-plus-config/mono-base-lint-config';
import { monoBaseVitestNodeConfig } from '@clankgster/vite-plus-config/mono-base-vitest-node-config';
import type { OxlintConfig } from 'oxlint';
import { defineConfig } from 'vite-plus';

const syncPackageLintOverrideFiles = npmPackFilesToLintGlobs.getLintGlobsForImportMetaUrl(
  import.meta.url
);

/** Enforced for `@clankgster/sync` only; keep aligned with `.oxlintrc.jsonc` (editor / `pnpm exec oxlint`). */
const syncMustNotDependOnE2eRules: NonNullable<OxlintConfig['rules']> = {
  'eslint/no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: '@clankgster/sync-e2e',
          message:
            '@clankgster/sync must not depend on @clankgster/sync-e2e; shared code belongs in this package.',
        },
      ],
      patterns: [
        {
          regex: 'clankgster-sync-e2e',
          message: '@clankgster/sync must not import paths containing clankgster-sync-e2e.',
        },
      ],
    },
  ],
};

export default defineConfig({
  ...monoBaseVitestNodeConfig,
  pack: {
    dts: { tsgo: true },
    exports: true,
  },
  lint: {
    ...monoBaseLintConfig,
    overrides: [
      ...(monoBaseLintConfig.overrides ?? []),
      {
        files: syncPackageLintOverrideFiles,
        rules: syncMustNotDependOnE2eRules,
      },
    ],
  },
  fmt: monoBaseFormatConfig,
});
