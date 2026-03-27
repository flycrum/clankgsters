# Organizing plugin content

**Purpose:** How to decide what goes where in a `.clank/plugins/<plugin>/` directory. Keeps content in the right type for agent discovery and context efficiency.

## Quick decision guide

| If the content is... | Put it in... |
| --- | --- |
| A convention or constraint agents should follow | `rules/` |
| A multi-step workflow agents execute | `skills/` |
| Detailed material shared by multiple skills or rules | `references/` |
| Background knowledge not linked from active content | `docs/` |
| A specialized sub-agent persona | `agents/` |
| Event-driven automation (deterministic, not AI) | `hooks/` |

For the full decision tree with branching logic and edge cases, see [content-type-decision-tree.md](../docs/clankgster-plugins-guide-content-type-decision-tree.md).

For an exhaustive feature comparison of all content types, see [content-type-comparison-matrix.md](../docs/clankgster-plugins-guide-content-type-comparison-matrix.md).

## Cross-referencing

- Use **relative paths** for all cross-references between files within a plugin
- Link from skills and rules **to** references (not the other way)
- Keep reference chains **one level deep** from the originating skill or rule
- Do not duplicate content across files — link to the single source

### Good cross-reference pattern

```markdown
For prompt engineering techniques, see
[prompt-techniques.md](../references/clankgster-plugins-guide-prompt-techniques.md).
```

### Avoid

- Circular references (A links to B, B links to A)
- Two-hop chains (SKILL.md → Ref A → Ref B) — link directly from SKILL.md to Ref B
- Duplicating reference content inline in the skill or rule body

## Plugin root files

Every plugin should have:

| File | Required | Purpose |
| --- | --- | --- |
| `README.md` | Yes | Human-readable index of plugin contents |
| `.claude-plugin/plugin.json` | Yes | Claude Code manifest |
| `.cursor-plugin/plugin.json` | Yes | Cursor manifest |

## Naming convention

All files in `rules/`, `commands/`, `skills/`, `agents/` must be prefixed with the plugin name:

```md
clankgster-plugins-guide-writing-rules.md     ← good
writing-rules.md                                     ← bad (collision risk)
```

Exempt files: `README.md`, `plugin.json`, `SKILL.md`, `hooks.json` — standard names stay as-is.

## Context window impact

Content types have different context window costs. Organize with this in mind:

| Type | Cost when idle | Cost when active |
| --- | --- | --- |
| Rules (always-on) | Full file loaded | Already loaded |
| Skill descriptions | ~100 tokens each | Already loaded |
| Skill bodies | 0 | Full body on invocation |
| References | 0 | Full file when linked from active content |
| Docs | 0 | Full file only when explicitly read |

Put high-frequency, always-relevant content in rules. Put detailed techniques in references. Put background material in docs.
