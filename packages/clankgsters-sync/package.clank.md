## Purpose

`@clankgsters/sync` is the publishable sync runtime package. `scripts/` is intentionally included in published files because consumers execute these entry scripts.

## Dependency Expectations

- Runtime flow depends on `xstate`, `zod`, `pino`, `neverthrow`, and `chalk`.
- Use workspace catalog versions for consistency across packages.

## Script Contracts

- `clankgsters-sync:clear` runs clear mode entry script.
- `clankgsters-sync:run` runs the main sync session entry script.
- These script names are delegated from the repository root `package.json`; keep names stable.
- Keep `scripts`, `dependencies`, `devDependencies`, and `peerDependencies` alpha-numerically sorted.

## Publishing Notes

- `dist` and `scripts` must remain in `files` for package consumers.
- `src/index.ts` can stay minimal while architecture bones are implemented in `scripts/`.
