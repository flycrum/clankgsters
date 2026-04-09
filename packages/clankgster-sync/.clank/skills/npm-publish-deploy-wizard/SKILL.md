---
name: npm-publish-deploy-wizard
description: Publish @clankgster/sync prereleases safely from a packed artifact so npm metadata never ships catalog/workspace dependency specs. Use for alpha/beta release, recovery from broken publish, and tag verification.
---

# npm-publish deploy wizard

Use this skill when publishing **`@clankgster/sync`** to npm.

## Rules

- Keep `catalog:` in source `package.json`
- Never publish raw source with plain `npm publish` from package dir
- Publish through packed artifact workflow:
  - `pnpm -F @clankgster/sync run release:preflight`
  - `pnpm -F @clankgster/sync run release:publish:alpha`

## Standard prerelease flow (`0.1.0-alpha.N`)

1. Ensure branch/commit state is correct on `main`
2. Bump version in `packages/clankgster-sync/package.json`
3. Update `packages/clankgster-sync/CHANGELOG.md`
4. Run:
   - `pnpm -F @clankgster/sync run release:preflight`
   - `pnpm -F @clankgster/sync run release:publish:alpha`
5. Verify registry:
   - `npm view @clankgster/sync@alpha version`
   - `npm view @clankgster/sync@alpha dependencies --json`
6. Tag/push release commit:
   - `git tag -a v<version> -m "Release <version>"`
   - `git push origin v<version>`

## Broken prerelease recovery

Use when previously published version has unresolved `catalog:` / `workspace:` in registry metadata.

1. Bump to next prerelease (`0.1.0-alpha.1`, etc.)
2. Run `release:preflight` and confirm packed manifest is publish-safe
3. Publish with `release:publish:alpha`
4. Verify `@alpha` now points to fixed version
5. Optional deprecation:
   - `npm deprecate @clankgster/sync@<broken-version> "Broken publish: unresolved catalog/workspace dependency specs. Use @clankgster/sync@alpha"`

## Required verification gate

Before calling release complete, confirm:

- `npm view @clankgster/sync@alpha dependencies --json` contains no `catalog:` or `workspace:`
- install smoke in non-workspace project succeeds
