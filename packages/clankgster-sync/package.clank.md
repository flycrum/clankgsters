# Purpose

`@clankgster/sync` is the publishable sync runtime package. **`src/`** holds the library and CLI implementation; **`scripts/`** holds thin entry files that are still shipped in `files` so consumers can execute them with `tsx` or reference paths under `node_modules`.

## Dependency Expectations

- Runtime flow depends on `xstate`, `zod`, `pino`, `neverthrow`, and `chalk`.
- Use workspace catalog versions for consistency across packages.
- **This package must not depend on `@clankgster/sync-e2e`.** E2E tests live in the e2e package and consume sync; the reverse would create a circular coupling. Shared types and helpers belong here (or a future shared package) and are re-exported from `src/index.ts` / `dist/`. Enforcement: Oxlint `eslint/no-restricted-imports` with overrides in `vite.config.ts` and repo `.oxlintrc.jsonc` (contract test: repo root `.oxlintrc-sync-no-e2e-dependency.spec.ts`).

## Public surfaces

- **`src/index.ts`** — canonical list of symbols meant for other monorepo packages and npm consumers. `vp pack src/index.ts` emits `dist/index.mjs` (and dts); `package.json` → `exports`.`"."` points at that bundle.
- **`package.json` → `exports`** — only `"."` maps to `./dist/index.mjs` (plus `package.json`). Deep imports into `src/` are not a supported public API unless you add explicit subpaths.

## Script Contracts

- `clankgster-sync:clear` runs clear mode entry script.
- `clankgster-sync:run` runs the main sync session entry script.
- These script names are delegated from the repository root `package.json`; keep names stable.
- Keep `scripts`, `dependencies`, `devDependencies`, and `peerDependencies` alpha-numerically sorted.

## Publishing Notes

- `dist`, `src`, `scripts`, and `bin` ship in `files` for package consumers.
- Release history and version intent: **[CHANGELOG.md](./CHANGELOG.md)**. Optional internal checklist: **`.clank/plugins/npm-publish/README.md`**.
- Publish guardrails: run **`release:preflight`** and publish through **`release:publish:alpha`** so npm metadata never ships raw `catalog:` / `workspace:` dependency specs.

## Monorepo root `clankgster.config.ts`

- Importing **`./packages/clankgster-sync/src/index.js`** is a **repo-relative path to TypeScript sources** resolved by the TS tooling; no `pnpm` workspace link is required.
- Adding **`@clankgster/sync`** to the root `package.json` as a **`workspace:*`** dependency is valid and lets you write `import { … } from '@clankgster/sync'`, but that resolves to **`dist/index.mjs`** per `package.json` `exports`, so you typically need `pnpm -F @clankgster/sync build` before Node loads the package entry without a bundler. For repo config files that are edited in TS without a prior build, **relative imports into `src/index.ts`** stay the practical choice.
