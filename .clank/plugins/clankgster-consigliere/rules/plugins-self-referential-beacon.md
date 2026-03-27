# Self-referential guide: this plugin as a beacon

**Purpose:** The `clankgster-consigliere` plugin is itself a well-structured example of good context engineering. Agents can reference its own structure, files, and writing patterns as a concrete model when creating or auditing other plugins.

## Rule

When creating, auditing, or refining plugin content and you need a concrete example of how to structure files, write descriptions, organize content types, or cross-reference between files — use this plugin (`clankgster-consigliere`) as a reference implementation.

## How to use as reference

Use the Glob tool to scan `.clank/plugins/clankgster-consigliere/` and the Read tool to examine specific files. Treat what you find as a working example of the conventions documented in this plugin's own rules and references.

Useful patterns to observe:

| Pattern | Where to find it |
| ------ | ------ |
| SKILL.md with 3-pass workflow | [plugins-writing-context](../skills/plugins-writing-context/SKILL.md) |
| Focused rule with Purpose/Rule/When | [common-writing-rules.md](common-writing-rules.md) |
| Reference with TOC and examples | [common-prompt-techniques.md](../references/common-prompt-techniques.md) |
| Decision tree in docs | [common-content-type-decision-tree.md](../docs/common-content-type-decision-tree.md) |
| Comparison matrix with footnotes | [common-content-type-comparison-matrix.md](../docs/common-content-type-comparison-matrix.md) |
| Plugin manifests (Claude + Cursor) | `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json` |
| README as index | `README.md` |
| Template files for each content type | [plugins-template-skill.md](../references/plugins-template-skill.md), [common-template-rule.md](../references/common-template-rule.md), [common-template-command.md](../references/common-template-command.md), [common-template-hooks.md](../references/common-template-hooks.md), [common-template-agent.md](../references/common-template-agent.md), [clankmd-template.md](../references/clankmd-template.md) |

## Guard rails

- Read this plugin's files via the Read tool or through a sub-agent (Agent tool with `subagent_type: "Explore"`) — do not modify them during the reference read
- Use the patterns you observe, not the literal content — adapt to the target plugin's domain
- This plugin follows its own conventions; when you spot a pattern here, it is intentional and worth replicating

## When it applies

- Creating a new plugin and unsure how to structure it
- Writing a SKILL.md and need to see a real example of the format
- Auditing a plugin and need a "known good" to compare against
- Explaining plugin conventions to a user

## When it does not apply

- The user explicitly asks for a different structure or convention
- The target domain has constraints that override these patterns (e.g., a plugin for a non-Clankgster system)
