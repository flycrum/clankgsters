---
name: turborepo-monorepo
description: Ported Turborepo notes from rawdocs.
---

# Turborepo (from rawdocs)

<!-- source: rawdocs/turborepo-general.readme.md -->

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


---

<!-- source: rawdocs/turborepo-dependencies.readme.md -->

# Turborepo dependencies

## Purpose

- Dependency management in the Mars monorepo: external vs workspace packages, root overrides. Agent reference. For general Turborepo/pnpm usage see [turborepo-general.readme.md](./turborepo-general.readme.md).

## External vs workspace packages

- **External (npm):** From registry (e.g. vue, vite, @tauri-apps/api). Add with `pnpm add <pkg>` in target workspace or `--filter <workspace>`. Shared tooling in root devDeps; app/package-specific in workspace [package.json](../package.json).
- **Workspace:** Under `apps/*`, `packages/*`. Use `workspace:*` when one workspace depends on another. Name with `@mars/` scope for packages (e.g. `@mars/dust-storm`); directory path is separate (e.g. `packages/dust-storm/`). Turbo runs `^build` so dependents build after their deps.

## Root overrides

- **pnpm.overrides** in root [package.json](../package.json) pin versions for the whole monorepo. Use for: core framework (Vue, etc.), build/tooling (Vite, TypeScript), test/formatter — anything that must be consistent. Don't use for: package-only deps, or when versions can differ by workspace.


### Iter 4
Deps section bump.
