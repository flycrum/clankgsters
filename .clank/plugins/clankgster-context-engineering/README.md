# clankgster-context-engineering plugin

Context engineering toolkit for writing agent-optimized plugin content. Codifies best practices for skills, rules, references, docs, and plugin organization across Claude Code, Cursor, and Codex.

## Layout

### Skills

**Content creation:**

- [`clankgster-write-plugins-context`](skills/clankgster-write-plugins-context/SKILL.md) — Transform raw content into optimized plugin files via a 3-pass workflow (draft, refine, finalize)

**Audit suite:**

- [`auditing-all-orchestrator`](skills/auditing-all-orchestrator/SKILL.md) — Master audit: runs all audit skills in parallel and produces a unified executive summary
- [`auditing-content-quality`](skills/auditing-content-quality/SKILL.md) — Reviews writing quality, prompt engineering, clarity, concision
- [`auditing-plugin-structure`](skills/auditing-plugin-structure/SKILL.md) — Checks directories, required files, naming conventions, content type placement
- [`auditing-internal-links`](skills/auditing-internal-links/SKILL.md) — Verifies all internal/relative markdown links resolve
- [`auditing-external-links`](skills/auditing-external-links/SKILL.md) — Checks external URLs for accessibility (404s, redirects)
- [`auditing-source-freshness`](skills/auditing-source-freshness/SKILL.md) — Checks if external documentation sources have been updated
- [`auditing-fact-check`](skills/auditing-fact-check/SKILL.md) — Verifies factual claims against current web sources
- [`auditing-comparison-matrix`](skills/auditing-comparison-matrix/SKILL.md) — Specialized audit for the content type comparison matrix and its footnotes

### Rules

- [`writing-rules`](rules/clankgster-context-engineering-writing-rules.md) — Conventions for writing effective rule files
- [`writing-skills`](rules/clankgster-context-engineering-writing-skills.md) — Conventions for writing effective SKILL.md files
- [`organizing-plugin-content`](rules/clankgster-context-engineering-organizing-plugin-content.md) — How to decide what goes where in a plugin
- [`self-referential-beacon`](rules/clankgster-context-engineering-self-referential-beacon.md) — This plugin can be used as a reference implementation of good context engineering

### References

Shared material linked from skills and rules:

- [`prompt-techniques`](references/clankgster-context-engineering-prompt-techniques.md) — Positive framing, XML tags, emphasis, checklists, sub-agents, tool requests
- [`writing-descriptions`](references/clankgster-context-engineering-writing-descriptions.md) — Description field best practices, testing, trigger phrases
- [`tool-calls`](references/clankgster-context-engineering-tool-calls.md) — Complete tool reference for Claude Code, Cursor, Codex
- [`progressive-disclosure`](references/clankgster-context-engineering-progressive-disclosure.md) — Loading model, layer design, context budget

**Annotated templates:**

- [`template-skill`](references/clankgster-context-engineering-template-skill.md) — SKILL.md template with WHY comments
- [`template-rule`](references/clankgster-context-engineering-template-rule.md) — Rule file template with WHY comments
- [`template-command`](references/clankgster-context-engineering-template-command.md) — Command file template with WHY comments
- [`template-hooks`](references/clankgster-context-engineering-template-hooks.md) — hooks.json template with WHY comments
- [`template-agent`](references/clankgster-context-engineering-template-agent.md) — Agent definition template with WHY comments

### Docs

Background material not linked from active content:

- [`content-type-decision-tree`](docs/clankgster-context-engineering-content-type-decision-tree.md) — "I have content X → which type?"
- [`content-type-comparison-matrix`](docs/clankgster-context-engineering-content-type-comparison-matrix.md) — Exhaustive feature comparison with footnotes
- [`deep-research-report`](docs/clankgster-context-engineering-deep-research-report.md) — Full research findings on context engineering (March 2026)

**Matrix detail docs (1:1 expanded context for each matrix section):**

- [`matrix-loading-behavior`](docs/clankgster-context-engineering-matrix-loading-behavior.md) — How each content type is loaded into agent context
- [`matrix-invocation-triggering`](docs/clankgster-context-engineering-matrix-invocation-triggering.md) — How each content type gets triggered
- [`matrix-metadata-frontmatter`](docs/clankgster-context-engineering-matrix-metadata-frontmatter.md) — Available frontmatter fields per type
- [`matrix-content-guidelines`](docs/clankgster-context-engineering-matrix-content-guidelines.md) — Length limits, structure, examples per type
- [`matrix-naming-organization`](docs/clankgster-context-engineering-matrix-naming-organization.md) — Naming conventions and sync behavior
- [`matrix-cross-agent-support`](docs/clankgster-context-engineering-matrix-cross-agent-support.md) — Claude, Cursor, Codex compatibility per type

## After changing this plugin

Run `pnpm clankgster-sync:run` from the monorepo root to sync changes into agent-specific directories. Verify outputs in `.claude/skills/` and `.claude/rules/`.
