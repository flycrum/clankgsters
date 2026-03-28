# clankgster-rawdocs plugin

Transforms user-authored `rawdocs/` input into structured plugin context (`skills/`, `rules/`, `references/`, `docs/`, `commands/`, `agents/`, `hooks/`) while preserving writer intent, style, and continuity over repeated syncs.

## Intent

This plugin exists for teams that want to write freely first, then organize later.

- Users can create one or more files in a plugin-local `rawdocs/` directory.
- `rawdocs/` content is treated as source truth for meaning and wording.
- Sync workflows then reorganize that content into high-quality plugin structure.

## Hard boundary

Files in `rawdocs/` are never link targets for the plugin's authored context files.

- Do not link to `rawdocs/` from `rules/`, `skills/`, `references/`, `docs/`, `commands/`, `agents/`, or `hooks/`.
- Keep `rawdocs/` as ingestion-only input and retain it unmodified during sync runs.

See [`rules/rawdocs-internal-linking.md`](rules/rawdocs-internal-linking.md).
See [`rules/rawdocs-opt-in-placement.md`](rules/rawdocs-opt-in-placement.md).

## Core skills

- [`docsraw-create-plugin`](skills/docsraw-create-plugin/SKILL.md): Creates a minimal rawdocs-enabled plugin scaffold and starter `rawdocs/getting-started.md`.
- [`docsraw-sync-run`](skills/docsraw-sync-run/SKILL.md): Orchestrates full sync lifecycle across isolated sub-agent analyses, planning, refinement, reset (excluding `rawdocs/`), and rewrite.
- [`docsraw-analyze-raw`](skills/docsraw-analyze-raw/SKILL.md): Analyzes only `rawdocs/` recursively.
- [`docsraw-analyze-existing`](skills/docsraw-analyze-existing/SKILL.md): Analyzes target plugin recursively excluding `rawdocs/`.

## Capo dependency

This plugin intentionally depends on `clankgster-capo` guidance for plugin writing and organization strategy. Cross-plugin linking is used intentionally in this plugin as an explicit exception for architecture coherence.

## Planning notes

The canonical internal plan and near-verbatim prompt transcript are documented in:

- [`docs/rawdocs-internal-planning-notes.md`](docs/rawdocs-internal-planning-notes.md)

## Quick start

### Common tasks

- **Create a new rawdocs structured plugin** -> use [`/docsraw-create-plugin`](skills/docsraw-create-plugin/SKILL.md)
- **Update (sync) an existing rawdocs structured plugin** -> use [`/docsraw-sync-run`](skills/docsraw-sync-run/SKILL.md)

### Prompt examples

#### Create a new rawdocs structured plugin

```text
Use /docsraw-create-plugin to scaffold a new plugin at .clank/plugins/my-plugin.
```

#### Update (sync) an existing rawdocs structured plugin

```text
Use /docsraw-sync-run for .clank/plugins/my-plugin.
```
