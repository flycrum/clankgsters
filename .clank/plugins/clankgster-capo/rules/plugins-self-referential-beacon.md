# Self-referential guide: this plugin as a beacon

**Purpose:** The `clankgster-capo` plugin is itself a well-structured example of good context engineering. Agents can reference its own structure, files, and write patterns as a concrete model when creating or audit other plugins.

## Rule

When creating, audit, or refining plugin content and you need a concrete example of how to structure files, write descriptions, organize content types, or cross-reference between files — use this plugin (`clankgster-capo`) as a reference implementation.

## How to use as reference

Use the Glob tool to scan `.clank/plugins/clankgster-capo/` and the Read tool to examine specific files. Treat what you find as a working example of the conventions documented in this plugin's own rules and references.

Useful patterns to observe:

| Pattern | Where to find it |
| ------ | ------ |
| SKILL.md with 3-pass workflow | [plugins-write-context](../skills/plugins-write-context/SKILL.md) |
| Focused rule with Purpose/Rule/When | [common-write-rules.md](common-write-rules.md) |
| Reference with TOC and examples | [common-prompt-techniques.md](../references/common-prompt-techniques.md); skill workflow addendum [skill-prompt-techniques.md](../skills/skills-write-context/references/skill-prompt-techniques.md) |
| Decision tree in docs | [common-content-type-decision-tree.md](../docs/common-content-type-decision-tree.md) |
| Comparison matrix with footnotes | [common-content-type-comparison-matrix.md](../docs/common-content-type-comparison-matrix.md) |
| Plugin manifests (Claude + Cursor) | `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json` |
| README as index | `README.md` |
| Template files for each content type | [skill-template.md](../skills/skills-write-context/docs/skill-template.md), [rule-template.md](../skills/plugins-write-context/docs/rule-template.md), [command-template.md](../skills/plugins-write-context/docs/command-template.md), [hooks-template.md](../skills/plugins-write-context/docs/hooks-template.md), [agent-template.md](../skills/plugins-write-context/docs/agent-template.md), [clankmd-template.md](../skills/clankmd-write-context/docs/clankmd-template.md) |

## Guard rails

- Read this plugin's files via the Read tool or through a sub-agent (Agent tool with `subagent_type: "Explore"`) — do not modify them during the reference read
- Use the patterns you observe, not the literal content — adapt to the target plugin's domain
- This plugin follows its own conventions; when you spot a pattern here, it is intentional and worth replicating

## When it applies

- Creating a new plugin and unsure how to structure it
- Write a SKILL.md and need to see a real example of the format
- Audit a plugin and need a "known good" to compare against
- Explaining plugin conventions to a user

## When it does not apply

- The user explicitly asks for a different structure or convention
- The target domain has constraints that override these patterns (e.g., a plugin for a non-Clankgster system)
