import type { FormatConfig } from 'oxfmt';

/**
 * Oxfmt defaults.
 * Configure via `fmt` in each package `vite.config.ts` (Vite+ / Oxfmt — not Prettier).
 * Editor (Oxc): keep root `.oxfmtrc.jsonc` aligned with this object — see repo `.vscode/settings.json`.
 *
 * `trailingComma: es5` applies to JS/TS. JSON files are ignored entirely by formatter defaults.
 */
export const monoBaseFormatConfig: FormatConfig = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  trailingComma: 'es5',
  semi: true,
  ignorePatterns: ['**/*.json'],
};
