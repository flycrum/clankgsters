# rawdocs opt-in placement

**Purpose:** Define how users opt into the rawdocs system and where `rawdocs/` must live inside a target plugin.

## Rule

Rawdocs mode is enabled implicitly when a plugin contains a top-level `rawdocs/` directory.

- `rawdocs/` must be colocated with standard plugin folders (`rules/`, `skills/`, `references/`, `docs/`, `commands/`, `agents/`, `hooks/`) at the same directory level.
- `rawdocs-struct-sync` should accept either plugin root path or rawdocs path, then normalize to:
  - `target_plugin_path`
  - `target_rawdocs_path`
- If `rawdocs/` is missing, stop and ask the user to create it before structural sync.

## Design rationale

- colocating `rawdocs/` keeps opt-in deterministic and local to one plugin
- explicit top-level placement avoids ambiguity around nested/raw staging folders
- path normalization improves repeatable orchestration across structural sync runs

## When it applies

- Initial setup for rawdocs in a plugin
- Any structural sync run that validates target paths
- Any diagnostic for "why rawdocs structural sync did not run"

## When it does not apply

- Plugin-agnostic docs that discuss rawdocs conceptually
- Read-only audit workflows that do not execute structural sync
