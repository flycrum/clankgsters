# Mutation taxonomy

Use this taxonomy to generate varied and realistic rawdocs mutations per iteration.

## File qualifiers

Scope of files affected:

- `one-file`
- `few-files`
- `several-files`
- `most-files`
- `all-files`

## File modifiers

Content-level operations (can be single or combined):

- `additions`
- `removals`
- `edits`

Allowed combinations:

- `additions`
- `removals`
- `edits`
- `additions+removals`
- `additions+edits`
- `removals+edits`
- `additions+removals+edits`

## File modifier qualifiers

Magnitude of change:

- `few`
- `moderate`
- `many`

## Filesystem modifiers (`fs-modifiers`)

Tree-shape operations:

- `create-file`
- `delete-files`
- `move-file`
- `create-folder`
- `delete-folder`
- `move-folder`

## Distribution targets (over a full loop)

Across the run, maintain a balanced mix:

- minor updates (`few`, limited scope)
- medium updates (`moderate`, multi-file)
- major updates (`many`, broad scope and/or fs changes)
- no-change iterations (`no-op`) to test stability

Recommended baseline distribution for 10 iterations:

- `2` no-op
- `3` minor
- `3` medium
- `2` major

If loop size differs, keep similar proportions.

## Realism constraints

- Keep edits plausible for developer-authored markdown.
- Prefer topic evolution, clarifications, expansions, and deprecations over random rewrites.
- Avoid synthetic noise not grounded in current rawdocs topics.
- For destructive fs operations, ensure resulting rawdocs tree remains valid markdown input.
