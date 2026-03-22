/**
 * Shared Vitest fragment for Node packages (mirrors @mmaappss/vitest-config `environment: 'node'`).
 * Tests still import from `vite-plus/test` (no `globals: true` needed).
 */
export const monoBaseVitestNodeConfig = {
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
};
