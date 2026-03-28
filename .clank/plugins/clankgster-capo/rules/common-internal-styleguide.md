# Internal styleguide for clankgster-capo

> 🔑🔑🔑 **Scope (clankgster-capo only).** Non-portability: [common-internal-disclosure-instructions.md](../references/common-internal-disclosure-instructions.md).

**Purpose:** Define internal naming and organization conventions **only** for the `.clank/plugins/clankgster-capo` plugin and its nested files and contents.

## Rule

For files in this plugin, use pathway prefixes only:

- `plugins-`
- `skills-`
- `clankmd-`
- `common-`

No exceptions for markdown content files in plugin-root `rules/`, `references/`, and `docs/` **except** the next bullet.

- **`references/common-audit/`:** Leaf files use short topic stems (for example `internal-links-scope.md`) so shared audit steps stay readable; the parent directory name carries the `common-` grouping. Structure audits should treat this as **intentional**, not a naming drift to fix by default.
- **`references/common_internal-*.md`:** Internal maintainer policy (underscore distinguishes from shared `common-*` references). Use for cross-cutting rules such as in-session vs MCP invocation.
- **`references/common-internal-disclosure-instructions.md`:** Shared non-portability text; docs that need it use one blockquote line: 🔑 scope + inline link to this file (no duplicated paragraphs).

For skill directories in `skills/`, use the same pathway prefixes.

Portability guardrail: never apply these prefixes to non-`clankgster-capo` plugins unless that plugin explicitly opts in.

## Skill-local exceptions

When documentation is colocated inside a specific skill directory, descriptive topic names are allowed:

- Allowed in `skills/<skill-name>/docs/*.md`, `skills/<skill-name>/references/*.md`, and `skills/<skill-name>/reference.md`
- Do not require pathway prefixes inside a skill-owned subtree, because the parent skill directory already provides scope
- Prefer one concern per file and link from the owning skill's `reference.md`

## Internal language

Use `internal` when discussing how `clankgster-capo` is maintained.

Do not use `external` in file names. Use the word only in this styleguide and [common-internal-guide-n-glossary.md](../docs/common-internal-guide-n-glossary.md) to explain the boundary.

## When it applies

- Refactoring this plugin
- Adding new files to this plugin
- Renaming existing files in this plugin

## When it does not apply

- Writing conventions for other plugins
- Writing conventions for standalone skills in other repos
- Authoring user-facing content outside this plugin
