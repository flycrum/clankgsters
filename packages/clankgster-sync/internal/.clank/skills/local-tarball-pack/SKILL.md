---
name: local-tarball-pack
description: Builds and packs a local npm tarball for @clankgster/sync without publishing. Use when validating package contents, testing pre-publish installs, or when the user asks to create and install a local .tgz artifact.
---

# Local Tarball Pack

## Scope

Create a reusable local tarball for `@clankgster/sync` from `packages/clankgster-sync`, place that tarball in a target project directory, then install it there for pre-publish testing.

## Pre-checks

1. Confirm the package path exists: `packages/clankgster-sync`.
2. Ensure dependencies are installed and `vp` + `pnpm` are available.
3. Run from repo root unless a step explicitly says otherwise.

## Steps

1. Set your target project root:

   ```bash
   TARGET_PROJECT_ROOT="/abs/path/to/target-project"
   ```

2. Build the package:

   ```bash
   vp run --filter @clankgster/sync build
   ```

3. Pack with `pnpm pack` and write the `.tgz` into the target project (not into this package directory):

   ```bash
   mkdir -p "${TARGET_PROJECT_ROOT}/.local-tarballs"
   pnpm --dir packages/clankgster-sync pack --pack-destination "${TARGET_PROJECT_ROOT}/.local-tarballs"
   ```

4. Install from the target project using its local tarball path (the **`.tgz` filename includes the version** from `packages/clankgster-sync/package.json`, e.g. `clankgster-sync-<version>.tgz`; use the file `pnpm pack` actually wrote):

   ```bash
   cd "${TARGET_PROJECT_ROOT}"
   pnpm add -w "./.local-tarballs/clankgster-sync-<version>.tgz"
   ```

5. Optional: pin the tarball in `package.json` for repeatable local testing:

   ```json
   {
     "dependencies": {
       "@clankgster/sync": "file:./.local-tarballs/clankgster-sync-<version>.tgz"
     }
   }
   ```

6. When package source changes, re-run Steps 2-4.

## Verification checklist

- `vp run --filter @clankgster/sync build` exits successfully.
- `pnpm --dir packages/clankgster-sync pack --pack-destination ...` exits successfully.
- A `.tgz` file is created under `${TARGET_PROJECT_ROOT}/.local-tarballs`.
- Installing the tarball in a test project succeeds.
- The installed package resolves `@clankgster/sync` exports and (if needed) the `clankgster-sync` bin command.

## Notes

- Use `pnpm pack` (not `npm pack`) for this package because publish-style packing resolves workspace `catalog:` dependency specs.
- Keeping tarballs under the target project (for example `.local-tarballs/`) allows project-local `file:` references and optional commit/versioning of test artifacts.
