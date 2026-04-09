# Changelog

**Field note:** this file is for humans doing upgrades. SemVer applies, including **`alpha`** / **`beta`**-style prerelease labels—see [Semantic Versioning](https://semver.org/) when in doubt.

## [0.1.0-alpha.1] - 2026-04-09

**Status:** recovery prerelease for npm consumers after `alpha.0` shipped unresolved workspace/catalog dependency specs in registry metadata.

### Fixed

- **Publish-safe dependency metadata**
  - `@clankgster/sync@alpha` now targets a release built from a packed artifact path so published dependency specs are concrete semver ranges (no raw `catalog:` / `workspace:` in registry-facing dependency sections).

### Added (initial alpha baseline)

- **Release guardrail scripts**
  - `release:preflight` runs check/test/build, packs the tarball, and blocks release if packed `package.json` still contains unsupported dependency specs.
  - `release:publish:alpha` publishes from that validated tarball flow (with `NPM_OTP` support).
- **Npm publish operator docs + skill**
  - npm-publish plugin README now documents required packed-artifact publish path and broken-prerelease recovery.
  - Added `npm-publish-deploy-wizard` skill with prerelease and recovery gates.

## [0.1.0-alpha.0] - 2026-04-08

**Status:** first **`@clankgster/sync`** publish to npm (still a prerelease; treat defaults and docs as “stable enough to try,” not “finished forever”).

### Added

- **npm prerelease**
  - Dist-tag **`alpha`** (`@clankgster/sync@alpha`); pin **`0.1.0-alpha.0`** if you want this exact build.
- **Adoption docs + repo root**
  - README: install from npm, `clankgster.config.ts`, `package.json` script patterns, **`CLANKGSTER_REPO_ROOT`** when dependencies live outside the repo root, source↔generated layout table, trust-sync reminder, clear vs run.
  - Runtime lines up with that doc: find `clankgster.config.ts` by walking from the installed **`@clankgster/sync`** package—**not** by trusting raw `process.cwd()` alone.
- **Multi-agent sync**
  - Inputs: `.clank/`, `CLANK.md`, `clankgster.config.ts`.
  - Outputs (per enabled agent): rules, marketplace / settings integration, root context files such as **`CLAUDE.md`**, **`AGENTS.md`**, **`AGENTS.override.md`**, **`CURSOR.md`**.
- **Native skill trees**
  - Plugin- and flat-layout skills under `.clank` materialize into each agent’s real skills directories (for example **`.claude/skills`**, **`.cursor/skills`**), not only as marketplace metadata.
- **Copy-first artifacts (default)**
  - Markdown is copied through a transform pipeline: **link rewrites**, **template variables** (delimiter config), optional **XML segment** hooks.
  - **`artifactMode: 'symlink'`** remains for older symlink workflows.
  - Optional **read-only** flag on generated files after write.
- **Manifest + cache**
  - **`${sourceDir}/.cache/sync-manifest.json`** keeps discovery, run, and teardown aligned (default **`sourceDir`**: **`.clank`** → **`.clank/.cache/sync-manifest.json`**).
  - **Clear** removes Clankgster-managed outputs and that cache footprint; it is **not** designed to wipe unrelated files you added beside agent folders.

[0.1.0-alpha.1]: https://github.com/flycrum/clankgster/releases/tag/v0.1.0-alpha.1
[0.1.0-alpha.0]: https://github.com/flycrum/clankgster/releases/tag/v0.1.0-alpha.0
