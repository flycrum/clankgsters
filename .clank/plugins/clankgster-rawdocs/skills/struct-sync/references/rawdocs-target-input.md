# rawdocs target input gate

Use this gate before running `rawdocs-struct-sync`.

## Mandatory first step

Always ask the user for explicit target path input before scanning.

Use AskUserQuestion as the first substantive step.

## What to ask

Ask the user for one of the following:

- plugin root path (for example `.clank/plugins/my-plugin`)
- `rawdocs/` path (for example `.clank/plugins/my-plugin/rawdocs`)

Clarify that the workflow will normalize this into:

- `target_plugin_path`
- `target_rawdocs_path`

## Validation

After user response:

1. Resolve path.
2. If path ends with `/rawdocs`, derive plugin root from parent.
3. Confirm plugin root exists.
4. Confirm `rawdocs/` exists under plugin root.
5. Retry once if invalid.

## Anti-patterns

- Inferring target from open editor files
- Inferring target from recent terminal paths
- Guessing plugin from repository search

