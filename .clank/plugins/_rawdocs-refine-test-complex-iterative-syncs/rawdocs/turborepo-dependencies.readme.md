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
