# Internal styleguide for clankgster-consigliere

**Purpose:** Define internal naming and organization conventions for this plugin itself.

## Rule

For files in this plugin, use pathway prefixes only:

- `plugins-`
- `skills-`
- `clankmd-`
- `common-`

No exceptions for markdown content files in `rules/`, `references/`, and `docs/`.

For skill directories in `skills/`, use the same pathway prefixes.

## Internal language

Use `internal` when discussing how `clankgster-consigliere` is maintained.

Do not use `external` in file names. Use the word only in this styleguide and [common-internal-guide-n-glossary.md](../docs/common-internal-guide-n-glossary.md) to explain the boundary.

## When it applies

- Refactoring this plugin
- Adding new files to this plugin
- Renaming existing files in this plugin

## When it does not apply

- Writing conventions for other plugins
- Writing conventions for standalone skills in other repos
- Authoring user-facing content outside this plugin

