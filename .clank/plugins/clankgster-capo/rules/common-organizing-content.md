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

## Naming

Use the plugin's internal naming standard. For `clankgster-capo`, use `plugins-`, `skills-`, `clankmd-`, or `common-` prefixes.

## Cross-references

- [common-content-type-decision-tree.md](../references/common-content-type-decision-tree.md)
- [common-content-type-comparison-matrix.md](../references/common-content-type-comparison-matrix.md)
