# clankgster-capo plugin

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

- **plugins/**:
  - [`plugins-audit-full-suite-plugin`](skills/plugins-audit-full-suite-plugin/SKILL.md)
  - [`plugins-audit-content-quality`](skills/plugins-audit-content-quality/SKILL.md)
  - [`plugins-audit-internal-links`](skills/plugins-audit-internal-links/SKILL.md)
  - [`plugins-audit-external-links`](skills/plugins-audit-external-links/SKILL.md)
  - [`plugins-audit-fact-check`](skills/plugins-audit-fact-check/SKILL.md)
  - [`plugins-audit-source-freshness`](skills/plugins-audit-source-freshness/SKILL.md)
  - [`plugins-audit-comparison-matrix`](skills/plugins-audit-comparison-matrix/SKILL.md)
  - [`plugins-audit-structure`](skills/plugins-audit-structure/SKILL.md)
- **skills/**:
  - [`skills-audit-full-suite-skill`](skills/skills-audit-full-suite-skill/SKILL.md)
  - [`skills-audit-content-quality`](skills/skills-audit-content-quality/SKILL.md)
  - [`skills-audit-internal-links`](skills/skills-audit-internal-links/SKILL.md)
  - [`skills-audit-external-links`](skills/skills-audit-external-links/SKILL.md)
  - [`skills-audit-fact-check`](skills/skills-audit-fact-check/SKILL.md)
  - [`skills-audit-source-freshness`](skills/skills-audit-source-freshness/SKILL.md)
- **CLANK.md**:
  - [`clankmd-audit-full-suite-md`](skills/clankmd-audit-full-suite-md/SKILL.md)
  - [`clankmd-audit-content-quality`](skills/clankmd-audit-content-quality/SKILL.md)
  - [`clankmd-audit-internal-links`](skills/clankmd-audit-internal-links/SKILL.md)
  - [`clankmd-audit-external-links`](skills/clankmd-audit-external-links/SKILL.md)
  - [`clankmd-audit-fact-check`](skills/clankmd-audit-fact-check/SKILL.md)
  - [`clankmd-audit-source-freshness`](skills/clankmd-audit-source-freshness/SKILL.md)

### Rules

- [`common-write-rules`](rules/common-write-rules.md)
- [`skills-write-rules`](rules/skills-write-rules.md)
- [`common-organizing-content`](rules/common-organizing-content.md)
- [`common-internal-styleguide`](rules/common-internal-styleguide.md)
- [`clankmd-write`](rules/clankmd-write.md)
- [`plugins-self-referential-beacon`](rules/plugins-self-referential-beacon.md)

### References

- [`common-prompt-techniques`](references/common-prompt-techniques.md)
- [`skills-write-context skill-prompt-techniques` (addendum)](skills/skills-write-context/references/skill-prompt-techniques.md)
- [`skills-write-context description-frontmatter`](skills/skills-write-context/docs/description-frontmatter.md)
- [`common-tool-calls`](references/common-tool-calls.md)
- [`common-progressive-disclosure`](references/common-progressive-disclosure.md)
- [`common-mcp-tools-in-plugins`](references/common-mcp-tools-in-plugins.md)
- [`clankmd-template`](skills/clankmd-write-context/docs/clankmd-template.md)
- [`skills-write-context skill-template`](skills/skills-write-context/docs/skill-template.md)
- [`plugins-write-context rule-template`](skills/plugins-write-context/docs/rule-template.md)
- [`plugins-write-context command-template`](skills/plugins-write-context/docs/command-template.md)
- [`plugins-write-context hooks-template`](skills/plugins-write-context/docs/hooks-template.md)
- [`plugins-write-context agent-template`](skills/plugins-write-context/docs/agent-template.md)

### Docs

- [`common-internal-guide-n-glossary`](docs/common-internal-guide-n-glossary.md)
- [`common-internal-mcp-routing-spec`](docs/common-internal-mcp-routing-spec.md)
- [`common-content-type-decision-tree`](references/common-content-type-decision-tree.md)
- [`common-content-type-comparison-matrix`](references/common-content-type-comparison-matrix.md)
- [`common-deep-research-report`](docs/common-deep-research-report.md)
- [`plugins-matrix-loading-behavior`](docs/plugins-matrix-loading-behavior.md)
- [`plugins-matrix-invocation-triggering`](docs/plugins-matrix-invocation-triggering.md)
- [`plugins-matrix-metadata-frontmatter`](docs/plugins-matrix-metadata-frontmatter.md)
- [`plugins-matrix-content-guidelines`](docs/plugins-matrix-content-guidelines.md)
- [`plugins-matrix-naming-organization`](docs/plugins-matrix-naming-organization.md)
- [`plugins-matrix-cross-agent-support`](docs/plugins-matrix-cross-agent-support.md)

### MCP

- [`.mcp.json`](.mcp.json) declares plugin-provided MCP tools.
- [`servers/capo-mcp-server.js`](servers/capo-mcp-server.js) implements explicit tool registration and route handoff payloads.
- [`common-internal-mcp-routing-spec`](docs/common-internal-mcp-routing-spec.md) is the canonical mapping contract.

## After changing this plugin

Run `pnpm clankgster-sync:run` from repo root.
