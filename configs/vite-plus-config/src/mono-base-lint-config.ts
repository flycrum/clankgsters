import type { OxlintConfig } from 'oxlint';

/**
 * Oxlint defaults aligned with @mmaappss/eslint-config: recommended-style strictness, Node + ES2022,
 * and `eslint/no-unused-vars` with `_`-prefixed exceptions (mirrors @typescript-eslint/no-unused-vars options).
 *
 * Omits `plugins` so Vite+ keeps its default plugin set; we only add rules, env, ignores, and type-aware options.
 */
export const monoBaseLintConfig: OxlintConfig = {
  ignorePatterns: [
    '**/dist/**',
    '**/node_modules/**',
    '**/.vite/**',
    '**/*.md',
    '**/pnpm-lock.yaml',
  ],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    'eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.spec-d.ts'],
      rules: {
        '@typescript-eslint/no-empty-object-type': 'off',
      },
    },
  ],
  options: {
    typeAware: true,
    typeCheck: true,
  },
};
