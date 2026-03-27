# clankgster-consigliere plugin

Context engineering toolkit for all three Clankgster source pathways: `plugins/`, `skills/`, and `CLANK.md`. Includes triaging, writing, updating, removing, auditing, and optional MCP tool wiring for chained workflows.

## Layout

### Skills

#### **Core action skills**

- [`common-triaging-context-type`](skills/common-triaging-context-type/SKILL.md)
- [`plugins-writing-context`](skills/plugins-writing-context/SKILL.md)
- [`plugins-updating-context`](skills/plugins-updating-context/SKILL.md)
- [`plugins-removing-context`](skills/plugins-removing-context/SKILL.md)
- [`skills-writing-context`](skills/skills-writing-context/SKILL.md)
- [`skills-updating-context`](skills/skills-updating-context/SKILL.md)
- [`skills-removing-context`](skills/skills-removing-context/SKILL.md)
- [`clankmd-writing-context`](skills/clankmd-writing-context/SKILL.md)
- [`clankmd-updating-context`](skills/clankmd-updating-context/SKILL.md)
- [`clankmd-removing-context`](skills/clankmd-removing-context/SKILL.md)

#### **Audit suite**

- [`common-auditing-all-orchestrator`](skills/common-auditing-all-orchestrator/SKILL.md)
- [`common-auditing-content-quality`](skills/common-auditing-content-quality/SKILL.md)
- [`common-auditing-plugin-structure`](skills/common-auditing-plugin-structure/SKILL.md)
- [`common-auditing-internal-links`](skills/common-auditing-internal-links/SKILL.md)
- [`common-auditing-external-links`](skills/common-auditing-external-links/SKILL.md)
- [`common-auditing-source-freshness`](skills/common-auditing-source-freshness/SKILL.md)
- [`common-auditing-fact-check`](skills/common-auditing-fact-check/SKILL.md)
- [`common-auditing-comparison-matrix`](skills/common-auditing-comparison-matrix/SKILL.md)

### Rules

- [`common-writing-rules`](rules/common-writing-rules.md)
- [`common-writing-skills`](rules/common-writing-skills.md)
- [`common-organizing-content`](rules/common-organizing-content.md)
- [`common-internal-styleguide`](rules/common-internal-styleguide.md)
- [`clankmd-writing`](rules/clankmd-writing.md)
- [`plugins-self-referential-beacon`](rules/plugins-self-referential-beacon.md)

### References

- [`common-prompt-techniques`](references/common-prompt-techniques.md)
- [`common-writing-descriptions`](references/common-writing-descriptions.md)
- [`common-tool-calls`](references/common-tool-calls.md)
- [`common-progressive-disclosure`](references/common-progressive-disclosure.md)
- [`common-mcp-tools-in-plugins`](references/common-mcp-tools-in-plugins.md)
- [`clankmd-template`](references/clankmd-template.md)
- [`plugins-template-skill`](references/plugins-template-skill.md)
- [`common-template-rule`](references/common-template-rule.md)
- [`common-template-command`](references/common-template-command.md)
- [`common-template-hooks`](references/common-template-hooks.md)
- [`common-template-agent`](references/common-template-agent.md)

### Docs

- [`common-guide-n-glossary`](docs/common-internal-guide-n-glossary.md)
- [`common-content-type-decision-tree`](docs/common-content-type-decision-tree.md)
- [`common-content-type-comparison-matrix`](docs/common-content-type-comparison-matrix.md)
- [`common-deep-research-report`](docs/common-deep-research-report.md)
- [`plugins-matrix-loading-behavior`](docs/plugins-matrix-loading-behavior.md)
- [`plugins-matrix-invocation-triggering`](docs/plugins-matrix-invocation-triggering.md)
- [`plugins-matrix-metadata-frontmatter`](docs/plugins-matrix-metadata-frontmatter.md)
- [`plugins-matrix-content-guidelines`](docs/plugins-matrix-content-guidelines.md)
- [`plugins-matrix-naming-organization`](docs/plugins-matrix-naming-organization.md)
- [`plugins-matrix-cross-agent-support`](docs/plugins-matrix-cross-agent-support.md)

### MCP

- [`.mcp.json`](.mcp.json) declares plugin-provided MCP tools
- [`servers/consigliere-mcp-server.js`](servers/consigliere-mcp-server.js) exposes triaging/writing/updating/removing/auditing tool handlers

## After changing this plugin

Run `pnpm clankgster-sync:run` from repo root.
