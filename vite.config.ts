import { monoBaseFormatConfig } from '@clankgsters/vite-plus-config/mono-base-format-config';
import { monoBaseLintConfig } from '@clankgsters/vite-plus-config/mono-base-lint-config';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: monoBaseLintConfig,
  fmt: monoBaseFormatConfig,
});
