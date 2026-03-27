---
name: auditing-all-orchestrator
description: >-
  Master audit orchestrator that runs all audit skills against a plugin in
  parallel groups using the Agent tool. Launches auditing-plugin-structure,
  auditing-internal-links, auditing-content-quality, auditing-fact-check,
  auditing-external-links, auditing-source-freshness, and optionally
  auditing-comparison-matrix as sub-agents. Collects results into a unified
  executive summary with health scores, top findings, and prioritized action
  items. Triggers — "full audit", "audit everything", "run all audits",
  "comprehensive plugin review", "audit plugin", master audit, complete audit.
---

# Audit orchestrator

Run all audit skills against a plugin and produce a unified executive summary.

## Scope

Orchestrates the 7 focused audit skills as sub-agents against a single plugin directory. Collects and synthesizes results. Does not perform auditing directly — delegates to specialized skills.

## Out of scope

- Direct auditing (each sub-skill handles its domain)
- Fixing issues found (report only)
- Auditing multiple plugins in one run (run once per plugin)

---

## Pre-checks

**STOP** if the Agent tool is not available. This skill requires sub-agent orchestration.

---

## 1. Determine plugin path

If a plugin path was provided by the user, use it. Otherwise, use AskUserQuestion:

> Which plugin should be audited? Provide the path (e.g., `.clank/plugins/clankgster-plugins-guide`) or plugin name.

Resolve the path to absolute. Use Glob to verify the directory exists.

---

## 2. Check for comparison matrix

Use Glob to check if the plugin has a comparison matrix file:

```md
<plugin-path>/docs/*comparison-matrix*
```

If found, include auditing-comparison-matrix in Group 4. If not, skip it.

---

## 3. Launch audit groups

Launch sub-agents using the Agent tool with `subagent_type: "general-purpose"`. Run groups in parallel where possible.

### Group 1 — Structure (launch in parallel)

<instructions>
Launch two sub-agents simultaneously:

**Sub-agent 1: Plugin structure**
Prompt: "Invoke the /auditing-plugin-structure skill for the plugin at `<absolute-plugin-path>`. Report all findings in a markdown table."

**Sub-agent 2: Internal links**
Prompt: "Invoke the /auditing-internal-links skill for the plugin at `<absolute-plugin-path>`. Report all findings in a markdown table."
</instructions>

### Group 2 — Content (launch in parallel)

<instructions>
Launch two sub-agents simultaneously:

**Sub-agent 3: Content quality**
Prompt: "Invoke the /auditing-content-quality skill for the plugin at `<absolute-plugin-path>`. Report all findings in a markdown table."

**Sub-agent 4: Fact-check**
Prompt: "Invoke the /auditing-fact-check skill for the plugin at `<absolute-plugin-path>`. Report all findings in a markdown table."
</instructions>

### Group 3 — External (launch in parallel)

<instructions>
Launch two sub-agents simultaneously:

**Sub-agent 5: External links**
Prompt: "Invoke the /auditing-external-links skill for the plugin at `<absolute-plugin-path>`. Report all findings in a markdown table."

**Sub-agent 6: Source freshness**
Prompt: "Invoke the /auditing-source-freshness skill for the plugin at `<absolute-plugin-path>`. Report all findings in a markdown table."
</instructions>

### Group 4 — Specialized (conditional)

<instructions>
Only if a comparison matrix was found in step 2:

**Sub-agent 7: Comparison matrix**
Prompt: "Invoke the /auditing-comparison-matrix skill for the plugin at `<absolute-plugin-path>`. Report all findings in a markdown table."
</instructions>

Groups can run in parallel if the Agent tool supports concurrent sub-agents. Otherwise, run sequentially: Group 1, then Group 2, then Group 3, then Group 4.

---

## 4. Collect results

Read the output from each sub-agent. Extract:

- Finding tables from each audit
- Counts (pass/warn/fail, OK/broken, verified/outdated, etc.)
- Individual summaries and recommendations

---

## 5. Produce unified executive summary

Output:

```markdown
## Plugin audit: <plugin-name>

### Health scores

| Category | Skill | Status | Summary |
|----------|-------|--------|---------|
| Structure | auditing-plugin-structure | Pass/Warn/Fail | N issues |
| Links (internal) | auditing-internal-links | Pass/Warn/Fail | N broken |
| Content quality | auditing-content-quality | Pass/Warn/Fail | N high / N med / N low |
| Fact accuracy | auditing-fact-check | Pass/Warn/Fail | N outdated / N incorrect |
| Links (external) | auditing-external-links | Pass/Warn/Fail | N broken |
| Source freshness | auditing-source-freshness | Pass/Warn/Fail | N stale |
| Comparison matrix | auditing-comparison-matrix | Pass/Warn/Fail/Skipped | N issues |

### Top 5 most critical findings

1. **[Category]** — description of the most impactful issue
2. **[Category]** — second most impactful
3. ...
4. ...
5. ...

### Recommended actions (priority order)

1. [Highest priority action with specific file and change]
2. [Second priority]
3. ...

### Detailed results

[Full output from each audit skill, organized by category]
```

Health score logic:

- **Pass** — no high-severity issues, fewer than 3 medium issues
- **Warn** — no high-severity issues but 3+ medium issues, OR 1 high-severity issue
- **Fail** — 2+ high-severity issues

---

## Verification checklist

- [ ] Plugin path resolved and verified
- [ ] All applicable audit skills launched (7, or 6 if no comparison matrix)
- [ ] Results collected from every sub-agent
- [ ] Health scores computed consistently across categories
- [ ] Top 5 findings selected by impact, not just frequency
- [ ] Action items are specific (file, line, change) not generic
- [ ] Full detailed results included after the summary

---

## Audit skills delegated

| Skill | Purpose | Group |
| ------- | --------- | ------- |
| [auditing-plugin-structure](../auditing-plugin-structure/SKILL.md) | Directory layout, required files, naming | 1 |
| [auditing-internal-links](../auditing-internal-links/SKILL.md) | Relative markdown link validity | 1 |
| [auditing-content-quality](../auditing-content-quality/SKILL.md) | Prompt engineering quality, clarity, framing | 2 |
| [auditing-fact-check](../auditing-fact-check/SKILL.md) | Factual claim verification | 2 |
| [auditing-external-links](../auditing-external-links/SKILL.md) | External URL accessibility | 3 |
| [auditing-source-freshness](../auditing-source-freshness/SKILL.md) | Documentation source currency | 3 |
| [auditing-comparison-matrix](../auditing-comparison-matrix/SKILL.md) | Matrix cell accuracy, footnotes, linked docs | 4 |

---

## Cross-references

- [Organizing plugin content](../../rules/clankgster-plugins-guide-organizing-plugin-content.md) — structural expectations
- [Prompt techniques](../../references/clankgster-plugins-guide-prompt-techniques.md) — quality criteria
- [Writing descriptions](../../references/clankgster-plugins-guide-writing-descriptions.md) — description field criteria
- [Content type comparison matrix](../../docs/clankgster-plugins-guide-content-type-comparison-matrix.md) — primary target for matrix audit
