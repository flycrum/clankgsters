# clankgster-consigliere plugin

Context engineering toolkit for all three Clankgster source pathways: `plugins/`, `skills/`, and `CLANK.md`.

## Important caveat

This plugin includes an advanced MCP-to-skill routing pattern for specialized orchestration use cases. It is intentionally overbuilt and is **not** the default recommendation for typical plugin authoring.

## Layout

### Skills

#### **Core action skills**

- [`common-triage-context-type`](skills/common-triage-context-type/SKILL.md)
- [`plugins-write-context`](skills/plugins-write-context/SKILL.md)
- [`plugins-update-context`](skills/plugins-update-context/SKILL.md)
- [`plugins-remove-context`](skills/plugins-remove-context/SKILL.md)
- [`skills-write-context`](skills/skills-write-context/SKILL.md)
- [`skills-update-context`](skills/skills-update-context/SKILL.md)
- [`skills-remove-context`](skills/skills-remove-context/SKILL.md)
- [`clankmd-write-context`](skills/clankmd-write-context/SKILL.md)
- [`clankmd-update-context`](skills/clankmd-update-context/SKILL.md)
- [`clankmd-remove-context`](skills/clankmd-remove-context/SKILL.md)

#### **Audit suite**

- [`common-audit-all-orchestrator`](skills/common-audit-all-orchestrator/SKILL.md)
- [`common-audit-content-quality`](skills/common-audit-content-quality/SKILL.md)
- [`common-audit-plugin-structure`](skills/common-audit-plugin-structure/SKILL.md)
- [`common-audit-internal-links`](skills/common-audit-internal-links/SKILL.md)
- [`common-audit-external-links`](skills/common-audit-external-links/SKILL.md)
- [`common-audit-source-freshness`](skills/common-audit-source-freshness/SKILL.md)
- [`common-audit-fact-check`](skills/common-audit-fact-check/SKILL.md)
- [`common-audit-comparison-matrix`](skills/common-audit-comparison-matrix/SKILL.md)

### Rules

- [`common-write-rules`](rules/common-write-rules.md)
- [`common-write-skills`](rules/common-write-skills.md)
- [`common-organizing-content`](rules/common-organizing-content.md)
- [`common-internal-styleguide`](rules/common-internal-styleguide.md)
- [`clankmd-write`](rules/clankmd-write.md)
- [`plugins-self-referential-beacon`](rules/plugins-self-referential-beacon.md)

### References

- [`common-prompt-techniques`](references/common-prompt-techniques.md)
- [`common-write-descriptions`](references/common-write-descriptions.md)
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

- [`common-internal-guide-n-glossary`](docs/common-internal-guide-n-glossary.md)
- [`common-internal-mcp-routing-spec`](docs/common-internal-mcp-routing-spec.md)
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

- [`.mcp.json`](.mcp.json) declares plugin-provided MCP tools.
- [`servers/consigliere-mcp-server.js`](servers/consigliere-mcp-server.js) implements explicit tool registration and route handoff payloads.
- [`common-internal-mcp-routing-spec`](docs/common-internal-mcp-routing-spec.md) is the canonical mapping contract.

## After changing this plugin

Run `pnpm clankgster-sync:run` from repo root.
