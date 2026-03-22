import { monoBaseFormatConfig } from '@clankgsters/vite-plus-config/mono-base-format-config';
import { monoBaseLintConfig } from '@clankgsters/vite-plus-config/mono-base-lint-config';
import { monoBaseVitestNodeConfig } from '@clankgsters/vite-plus-config/mono-base-vitest-node-config';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  ...monoBaseVitestNodeConfig,
  pack: {
    dts: { tsgo: true },
    exports: true,
  },
  lint: monoBaseLintConfig,
  fmt: monoBaseFormatConfig,
});
