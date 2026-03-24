import type { FormatConfig } from 'oxfmt';

/**
 * Oxfmt defaults.
 * Configure via `fmt` in each package `vite.config.ts` (Vite+ / Oxfmt — not Prettier).
 * Editor (Oxc): keep root `.oxfmtrc.jsonc` aligned with this object — see repo `.vscode/settings.json`.
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
