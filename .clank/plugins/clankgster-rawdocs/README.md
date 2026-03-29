# clankgster-rawdocs plugin

Transforms user-authored `rawdocs/` input into structured plugin context (`skills/`, `rules/`, `references/`, `docs/`, `commands/`, `agents/`, `hooks/`) while preserving writer intent, style, and continuity over repeated structural syncs.

## Intent

This plugin exists for teams that want to write freely first, then organize later.

- Users can create one or more files in a plugin-local `rawdocs/` directory.
- `rawdocs/` content is treated as source truth for meaning and wording.
- Structify sync workflows then reorganize that content into high-quality plugin structure.

## Hard boundary

Files in `rawdocs/` are never link targets for the plugin's authored context files.

- Do not link to `rawdocs/` from `rules/`, `skills/`, `references/`, `docs/`, `commands/`, `agents/`, or `hooks/`.
- Keep `rawdocs/` as ingestion-only input and retain it unmodified during structural sync runs.

See [`rules/rawdocs-internal-linking.md`](rules/rawdocs-internal-linking.md).
See [`rules/rawdocs-opt-in-placement.md`](rules/rawdocs-opt-in-placement.md).

## Core skills

- [`rawdocs-create-plugin`](skills/create-plugin/SKILL.md): Creates a minimal rawdocs-enabled plugin scaffold and starter `rawdocs/getting-started.md`.
- [`rawdocs-seed-test-iterative-syncs`](skills/seed-test-iterative-syncs/SKILL.md): Creates or recreates the complex iterative-sync test fixture and seeds `rawdocs/` from the multi-file [`references/test-complex-rawdocs/`](references/test-complex-rawdocs/) bundle.
- [`rawdocs-struct-sync`](skills/struct-sync/SKILL.md): Orchestrates full structural sync lifecycle across isolated sub-agent analyses, planning, refinement, reset (excluding `rawdocs/`), and rewrite.
- [`rawdocs-analyze-raw`](skills/analyze-raw/SKILL.md): Analyzes only `rawdocs/` recursively.
- [`rawdocs-analyze-existing`](skills/analyze-existing/SKILL.md): Analyzes target plugin recursively excluding `rawdocs/`.
- [`rawdocs-test-iterative-syncs-loop-round`](skills/test-iterative-syncs-loop-round/SKILL.md): Executes one continuity round: **rawdocs-only** mutations (taxonomy + fixed continuity edit), then run-1 / run-2 structural sync, scoring, and round report.
- [`rawdocs-test-iterative-syncs-loop`](skills/test-iterative-syncs-loop/SKILL.md): Owns strict full-budget loop sequencing and delegates each round to the round skill.
- [`rawdocs-refine-test-iterative-syncs`](skills/refine-test-iterative-syncs/SKILL.md): Thin orchestrator for fixture seeding, loop execution, and final refinement report.

## Capo dependency

This plugin intentionally depends on `clankgster-capo` guidance for plugin writing and organization strategy. Cross-plugin linking is used intentionally in this plugin as an explicit exception for architecture coherence.

## Planning notes

The canonical internal plan and near-verbatim prompt transcript are documented in:

- [`docs/rawdocs-internal-planning-notes.md`](docs/rawdocs-internal-planning-notes.md)

## Quick start

### Common tasks

- **Create a new rawdocs structured plugin** -> use [`/rawdocs-create-plugin`](skills/create-plugin/SKILL.md)
- **Update (structural sync) an existing rawdocs structured plugin** -> use [`/rawdocs-struct-sync`](skills/struct-sync/SKILL.md)

### Prompt examples

#### Create a new rawdocs structured plugin

```text
Use /rawdocs-create-plugin to scaffold a new plugin at .clank/plugins/my-plugin.
```

#### Update (structural sync) an existing rawdocs structured plugin

```text
Use /rawdocs-struct-sync for .clank/plugins/my-plugin.
```
