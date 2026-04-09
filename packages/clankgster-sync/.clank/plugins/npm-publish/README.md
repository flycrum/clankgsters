# npm-publish plugin

Internal release guardrails for publishing **`@clankgster/sync`** to npm while keeping `catalog:` in source `package.json` and shipping concrete semver in the published artifact.

## Safe publish path (required)

1. Pick next prerelease semver (`0.1.0-alpha.N`) and commit on `main`
2. Run preflight from package root (or via workspace):
   - `pnpm -F @clankgster/sync run release:preflight`
3. Publish from the packed tarball flow (not raw source publish):
   - `pnpm -F @clankgster/sync run release:publish:alpha`

### Why this exists

- Raw `npm publish` from source can leak unresolved `catalog:` specs into registry metadata
- `release:preflight` fails if packed `package.json` contains `catalog:` or `workspace:` in `dependencies` / `peerDependencies` / `optionalDependencies`

## Recovery flow for broken prerelease

If a prerelease was published with unresolved workspace/catalog specs:

1. Bump to next prerelease (`0.1.0-alpha.1`, `0.1.0-alpha.2`, ...)
2. Run `release:preflight` and verify output says packed specs are publish-safe
3. Publish with `release:publish:alpha`
4. Verify registry metadata:
   - `npm view @clankgster/sync@alpha version`
   - `npm view @clankgster/sync@alpha dependencies --json`
5. Optional: deprecate broken version
   - `npm deprecate @clankgster/sync@<broken-version> "Broken publish: unresolved catalog/workspace dependency specs. Use @clankgster/sync@alpha"`

## Where humans look

- Package **README** and **[CHANGELOG.md](../../../CHANGELOG.md)** in `packages/clankgster-sync/`
- Npm publish skill: `skills/npm-publish-deploy-wizard/SKILL.md`
