import type { FormatConfig } from 'oxfmt';

/**
 * Oxfmt defaults aligned with @mmaappss/prettier-config (printWidth 100, single quotes, es5 commas, semicolons).
 * Configure via `fmt` in each package `vite.config.ts` (Vite+ / Oxfmt — not Prettier).
 *
 * `trailingComma: es5` applies to JS/TS. The `package.json` override (glob `**` + `/package.json`) uses `trailingComma: none` because standard JSON does not allow trailing commas.
 */
export const monoBaseFormatConfig: FormatConfig = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  trailingComma: 'es5',
  semi: true,
  overrides: [
    {
      files: ['**/package.json'],
      options: {
        trailingComma: 'none',
      },
    },
  ],
};
