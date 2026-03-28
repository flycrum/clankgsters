---
name: plugins-write-context
description: >-
  Writes source pathway `plugins/` content from raw input using a draft/refine/
  finalize workflow. Use when creating or expanding a plugin with coordinated
  skills, rules, references, docs, and manifests.
---

# Write plugin context

## Scope

Create or expand plugin content under source pathway `plugins/`.

This skill is a direct execution workflow. In-session agents should follow this `SKILL.md` body; capo MCP route `plugins.write` (`PluginsWrite`) is an optional tool surface for the same workflow — see [common_internal-in-session-vs-mcp-policy.md](../../references/common_internal-in-session-vs-mcp-policy.md).

## Naming portability guardrail

When authoring a target plugin, follow that target plugin's own naming conventions.

- Do not apply `clankgster-capo` internal prefix conventions (`plugins-`, `skills-`, `clankmd-`, `common-`) to other plugins by default.
- Do not prepend a target plugin name to skill directory names unless the target plugin explicitly requires it.

## Plugin content type notes

### Skills

Plugin skills use the same `SKILL.md` structure and frontmatter conventions as standalone source pathway `skills/`, but they live under `plugins/<plugin>/skills/` and are coordinated with sibling plugin content types. For canonical SKILL.md authoring guidance, use [skills-write-context/reference.md](../skills-write-context/reference.md).

### Rules

Rules define conventions and constraints (not workflows). Use [rule-template.md](docs/rule-template.md).

### References

References hold detailed guidance linked from active skills and rules. Keep one concern per file and avoid inlining into SKILL bodies. Use [common-progressive-disclosure.md](../../references/common-progressive-disclosure.md).

### Docs

Docs are deep/background material that should be read explicitly when needed. For the matrix-backed detail set, use the hub list in [common-content-type-comparison-matrix.md](../../references/common-content-type-comparison-matrix.md) (links into `docs/plugins-matrix-*.md`); do not add new cross-links from rules, references, or skills into `docs/` except via that pattern—see [common-plugin-docs-folder-linking.md](../../references/common-plugin-docs-folder-linking.md).

### Commands

Commands are deterministic slash workflows and should remain focused and concise. Use [command-template.md](docs/command-template.md).

### Agents

Agents are persona-driven sub-agents for specialized tasks. Use [agent-template.md](docs/agent-template.md).

### Hooks

Hooks are event-driven automations and should remain deterministic and scoped. Use [hooks-template.md](docs/hooks-template.md).

## Steps

1. Gather input (text, files, URLs).
2. Read [reference.md](reference.md) for plugin content-type guidance and links.
3. Classify by plugin content type (`skills/`, `rules/`, `references/`, `docs/`, `commands/`, `agents/`, `hooks/`).
4. Plan file list and cross-links.
5. Draft files.
6. Refine descriptions and references.
7. Finalize and verify naming/link integrity, using target-plugin conventions.

## Verification

- [ ] Output is in source pathway `plugins/`
- [ ] Skills include valid frontmatter
- [ ] Rules are conventions (not workflows)
- [ ] References/docs are linked and non-duplicative

## Cross-references

- [reference.md](reference.md)
