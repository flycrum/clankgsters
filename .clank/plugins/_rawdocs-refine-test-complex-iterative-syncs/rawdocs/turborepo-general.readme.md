# Turborepo general (clarified)

## Purpose

- General Turborepo 2.x and pnpm usage for the Mars monorepo. Agent reference. For dependency specifics see [turborepo-dependencies.readme.md](./turborepo-dependencies.readme.md).

## Orchestration

- **Turborepo 2.x** orchestrates workspaces: parallel tasks, smart caching, root as source of truth.
- Commands from root (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm format`, `pnpm type-check`, `pnpm test`) run across all workspaces.
- Task config in root [turbo.json](../turbo.json); `^build` runs dependencies first.

## pnpm (exclusive)

- Use **pnpm only** (no npm/yarn). Fast, strict dependency tree, workspace support.
- Root [package.json](../package.json) holds shared devDeps (turbo, eslint, prettier, typescript).
- Per-workspace deps in each [package.json](../package.json) under [pnpm-workspace.yaml](../pnpm-workspace.yaml) globs (`apps/*`, `packages/*`).

## Commands

See [.cursor/rules/turborepo-rules.mdc](../.cursor/rules/turborepo-rules.mdc) and [.cursor/rules/turborepo-rules-dependencies.mdc](../.cursor/rules/turborepo-rules-dependencies.mdc) for install, add, filter, and file-scoped commands.


## Iter 6
Orchestration note.
