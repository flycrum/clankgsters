# Organizing content

**Purpose:** Decide where content belongs across Clankgster source pathways and, for plugins, across plugin content types.

## Pathway decision first

| If the content is... | Put it in... |
| --- | --- |
| A collection of related skills/rules/references/docs | source pathway `plugins/` |
| A single standalone workflow | source pathway `skills/` |
| Critical global instructions loaded every session | source pathway `CLANK.md` |

## Within-plugin content decision

| If the content is... | Put it in... |
| --- | --- |
| Convention or constraint | `rules/` |
| Multi-step workflow | `skills/` |
| Shared detailed material | `references/` |
| Background research | `docs/` |
| Sub-agent persona | `agents/` |
| Deterministic event automation | `hooks/` |

### `docs/` vs `references/` (markdown links)

`docs/` holds background and deep material you expect someone to open deliberately (and README-style indexes may list those paths). If **another** plugin file—`rules/`, `references/*.md`, or `skills/**`—needs a **followable markdown link** to that prose, the content usually belongs in **`references/`** instead (plugin-wide shared depth). For depth scoped to one skill, prefer that skill’s **`reference.md`** or files under the same `skills/<name>/` tree (`references/` or `docs/` there). Exception: a designated hub in `references/` may link into specific `docs/` children when the set is intentionally split (see [common-plugin-docs-folder-linking.md](../references/common-plugin-docs-folder-linking.md) and **plugins-audit-internal-links**).

## Naming

Use the plugin's internal naming standard. For `clankgster-capo`, use `plugins-`, `skills-`, `clankmd-`, or `common-` prefixes.

## Cross-references

- [common-content-type-decision-tree.md](../references/common-content-type-decision-tree.md)
- [common-content-type-comparison-matrix.md](../references/common-content-type-comparison-matrix.md)
