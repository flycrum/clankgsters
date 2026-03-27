---
name: clankgster-write-plugins-context
description: >-
  Transform raw content (text, research, URLs, files) into optimized Clankgster
  plugin files — SKILL.md, rules, references, docs, README, manifests. Runs a
  3-pass workflow: draft, refine, finalize. Writes YAML frontmatter with
  high-signal descriptions, organizes for AI agent consumption, applies
  progressive disclosure. Triggers — "write plugin content", "create a skill
  from this", "turn this into rules", "optimize this for agents", "update
  clank plugin with", plugin authoring, new plugin content from raw research.
---

# Write plugins context

Transform raw content into well-structured, agent-optimized plugin files for the Clankgster plugin system (`.clank/plugins/`).

## Scope

This skill produces plugin content files: SKILL.md, rules, references, docs, README.md, and plugin manifests. All output goes to `.clank/plugins/<plugin>/`. The sync system handles wiring to `.claude/`, `.cursor/`, and `.codex/` — never hand-edit agent-specific directories.

## Out of scope

- Application source code
- CI/CD configuration
- Agent-specific config files (`.claude/settings.json`, `.cursor/settings.json`)
- Running the sync system (tell the user to run `pnpm clankgster-sync:run` after)

---

## 1. Gather input

Accept content from one or more sources:

- **Direct text** in the conversation
- **File paths** — use the Read tool to read each file
- **URLs** — use the WebFetch tool to fetch each URL
- **Combination** of the above

If no content is provided, use the AskUserQuestion tool to ask:

1. What content or topic should be turned into plugin files?
2. Which plugin is this for? (existing plugin name or new plugin name)
3. Where should the plugin live? (see source layout options below)

### Plugin source layouts

The most common location is `.clank/plugins/` at the **repository root**, but plugins can exist at any directory level. The sync system supports multiple source layouts:

| Layout | Path pattern | Example |
| ------ | ------ | ------ |
| Nested (default) | `<sourceDir>/plugins/<plugin>/` | `.clank/plugins/my-plugin/` |
| Nested local | `<sourceDir>/plugins.local/<plugin>/` | `.clank/plugins.local/my-plugin/` |
| Shorthand | `<sourceDir>-plugins/<plugin>/` | `.clank-plugins/my-plugin/` |
| Shorthand local | `<sourceDir>-plugins.local/<plugin>/` | `.clank-plugins.local/my-plugin/` |

**`.local` plugins** are developer-specific and typically gitignored — useful for personal workflows, experiments, or overrides that should not be shared with the team. Ask the user if the plugin should be `.local`.

If the user specifies an existing plugin, use the Glob tool to read its current structure before proceeding.

---

## 2. Analyze content

Parse all input and classify each chunk:

<instructions>
For each piece of content, determine:

1. **Is it a convention or constraint?** → candidate for a **rule**
2. **Is it a multi-step workflow?** → candidate for a **skill**
3. **Is it detailed reference material used by multiple files?** → candidate for a **reference**
4. **Is it background knowledge not directly actionable?** → candidate for a **doc**
5. **Is it a mix?** → split into the appropriate types

**The non-inferable principle is the single most impactful filter for content quality.**
Include only details the agent genuinely cannot figure out from the code or its training.
Standard practices the model already knows waste tokens and dilute the high-signal content.
For every paragraph, ask: "If I removed this, would the agent produce worse output?"
If not, cut it. (Source: ETH Zurich research on AI coding agent instruction effectiveness.)

Prioritize by agent impact:

- High: workflows the agent executes, conventions it must follow, descriptions it
  uses for discovery
- Medium: reference material that improves output quality
- Low: background knowledge, historical context, nice-to-know information

For the full classification logic, see the
[content type decision tree](../../docs/clankgster-context-engineering-content-type-decision-tree.md).
</instructions>

---

## 3. Plan file structure

Before writing, plan the complete file structure:

1. **List each file** with its type (skill, rule, reference, doc)
2. **Name each file** with the plugin name prefix (e.g., `plugin-name-topic.md`)
3. **Map cross-references** — which files link to which
4. **Verify uniqueness** — no file name collisions with existing plugin files

Present the plan to the user as a markdown table:

| Type | File | Purpose |
| ------ | ------ | --------- |
| Skill | `skills/doing-x/SKILL.md` | Workflow for doing X |
| Rule | `rules/plugin-name-convention-y.md` | Convention Y |
| Reference | `references/plugin-name-topic-z.md` | Shared detail for Z |

If the plan involves more than 8 files, use the Agent tool with `subagent_type: "general-purpose"` to write files in parallel groups.

---

## 4. Pass 1 — Draft

Write initial versions of all planned files.

### For each SKILL.md

<instructions>
1. Write YAML frontmatter:
   - `name`: gerund form preferred (processing-X, analyzing-Y), kebab-case,
     1-64 chars, must match directory name
   - `description`: this is the MOST important field. Follow these rules:
     a. Third person voice ("Transforms..." not "I transform...")
     b. First sentence: what it does
     c. Second sentence: when to use it, with trigger phrases
     d. 150-700 characters (sweet spot for discovery vs budget)
     e. Front-load distinctive terms
     f. No XML tags, no markdown formatting
     g. Include scope boundaries if disambiguation is needed
2. Write body sections in this order:
   a. Scope (1-2 paragraphs: what this does, what it does not)
   b. Pre-checks with **STOP** conditions for hard failures
   c. Numbered steps with action verbs (Read, Write, Run, Verify)
   d. Verification checklist (5-10 concrete, measurable items)
   e. Cross-references to relevant reference files
3. Target: under 500 lines / 5,000 tokens for the body
</instructions>

### For each rule

<instructions>
1. H1 title — clear, descriptive
2. **Purpose:** line — one sentence explaining the rule and why
3. Rule section — the convention stated clearly, positive framing
4. When it applies / When it does not — scope boundaries
5. Good/bad examples (2-3 pairs, 3-5 lines each)
6. Link to references for detailed techniques if needed
7. Target: under 200 lines preferred
</instructions>

### For each reference

<instructions>
1. H1 title
2. Table of contents (if over 100 lines)
3. Focused sections with clear headings
4. Good/bad examples for each technique or pattern
5. Use XML tags (examples, instructions, constraints) where content mixes types
6. No length ceiling, but keep focused — one topic per file
</instructions>

### For each doc

<instructions>
1. H1 title
2. Table of contents (recommended)
3. Comprehensive coverage — docs are not constrained by context window budget
4. Include source URLs and attribution where relevant
5. Tables for structured comparisons
</instructions>

### Plugin manifests (if creating a new plugin)

Create both `.claude-plugin/plugin.json` and `.cursor-plugin/plugin.json`:

```json
{
  "name": "<plugin-name>",
  "version": "0.1.0",
  "description": "<one-sentence plugin purpose>",
  "author": { "name": "clankgster" }
}
```

Cursor manifest adds: `"keywords": ["term1", "term2", ...]`

### README.md (if creating a new plugin)

<instructions>
1. H1 with plugin name
2. Purpose — one paragraph explaining what the plugin provides
3. Layout — bullet list of each subdirectory with brief descriptions and relative links
4. After-change instructions — "Run `pnpm clankgster-sync:run` after editing this plugin"
5. Neutral/technical voice (no persona)
6. Target: 20-60 lines
</instructions>

---

## 5. Pass 2 — Refine

Re-read each drafted file and apply quality improvements.

<instructions>
For each file:

1. **Descriptions** — re-evaluate every description field:
   - Is it specific enough to distinguish from other skills?
   - Does it include trigger phrases a user would actually type?
   - Is it in third person?
   - Is it under 1,024 characters?
   - Would you pick this skill from a list of 20 based on the description alone?

2. **Prompt techniques** — apply these patterns:
   - Replace negative instructions with positive alternatives where possible
   - Add brief reasoning ("why") to key constraints to improve adherence
   - Ensure XML tags are used where content mixes types (instructions, context, examples)
   - Confirm emphasis is calibrated for Claude 4.6: no ALL CAPS paragraphs,
     no "CRITICAL: You MUST...", bold for key terms, `**STOP**` for hard breaks only
   - Check that checklists have concrete, measurable items

3. **Progressive disclosure** — verify layering:
   - Descriptions contain "what" and "when" only
   - Skill bodies contain "how" (steps and workflow)
   - Detailed techniques are in references, not inlined
   - References are one level deep from the linking file

4. **Cross-references** — verify all relative paths resolve correctly:
   - From skills to references: `../../references/<name>.md`
   - From rules to references: `../references/<name>.md`
   - From rules to docs: `../docs/<name>.md`

5. **Length** — verify each file is within limits:
   - SKILL.md body: under 500 lines
   - Rules: under 200 lines preferred
   - References: TOC if over 100 lines
   - Descriptions: 1-1,024 characters

6. **Naming** — verify plugin-name prefix on all files in rules/, commands/, skills/, agents/

7. **Inferable content** — cut anything the agent already knows from training.
   Challenge each paragraph: "Does the agent need this to produce correct output?"
</instructions>

For detailed prompt techniques, see [prompt-techniques.md](../../references/clankgster-context-engineering-prompt-techniques.md).

For description writing guidance, see [writing-descriptions.md](../../references/clankgster-context-engineering-writing-descriptions.md).

---

## 6. Pass 3 — Finalize

Final self-verification and output.

### Verification checklist

Run through this checklist for every file produced:

- [ ] File name has the plugin-name prefix (except README.md, plugin.json, SKILL.md)
- [ ] SKILL.md has YAML frontmatter with `name` and `description`
- [ ] Description is 1-1,024 characters, third person, includes trigger phrases
- [ ] Description contains no XML tags or markdown formatting
- [ ] SKILL.md body is under 500 lines
- [ ] Rule files are under 200 lines (preferred) or 500 lines (max)
- [ ] Reference files over 100 lines have a table of contents
- [ ] All cross-reference relative paths are valid
- [ ] Positive instructions used over negative (check for "Don't" / "Never" without alternatives)
- [ ] No inferable content remains (standard practices the model already knows)
- [ ] XML tags are used where content mixes types
- [ ] Plugin manifests exist for both `.claude-plugin` and `.cursor-plugin`
- [ ] README.md exists and links all content
- [ ] Emphasis is calibrated (no ALL CAPS paragraphs, bold for key terms only)

### Write final files

Use the Write tool for new files and the Edit tool for modifications to existing files.

### Summary report

After writing all files, output a summary table:

```markdown
## Files created/modified

| Type | File | Lines | Status |
|------|------|-------|--------|
| Skill | skills/doing-x/SKILL.md | 180 | Created |
| Rule | rules/plugin-name-y.md | 85 | Created |
| ... | ... | ... | ... |

**Next step:** Run `pnpm clankgster-sync:run` from the monorepo root to sync.
```

---

## Writing guidelines (quick reference)

These are condensed guidelines for writing. For full detail, follow the linked references.

### Audience and voice

- Write for **AI agents as the primary audience**, not humans
- Keep condensed and succinct; sacrifice grammar for concision
- Omit punctuation at end of bullet points and list items
- Use imperative mood ("Read the file" not "You should read the file")
- Omit filler words, preamble, and hedging ("Note that..." → just state it)
- Every sentence should earn its tokens — if it does not change agent behavior, cut it

### Instructions

- Use **positive framing** ("Write in prose" not "Don't use markdown")
- Add **reasoning** to key constraints ("Use relative paths — absolute paths break in CI")
- Use **numbered steps** for sequential workflows, bullets for parallel options
- Use `**STOP**` for hard precondition failures only
- See [prompt-techniques.md](../../references/clankgster-context-engineering-prompt-techniques.md)

### Descriptions

- Third person, 150-700 characters, front-load distinctive terms
- Include trigger phrases AND scope boundaries
- See [writing-descriptions.md](../../references/clankgster-context-engineering-writing-descriptions.md)

### Structure

- Use XML tags when mixing instructions, context, and examples in one section
- Use markdown headings for top-level sections
- Use tables for structured comparisons and summaries
- Use checklists for verification (end of workflow, not beginning)
- See [progressive-disclosure.md](../../references/clankgster-context-engineering-progressive-disclosure.md)

### Tools

- Name specific tools: "Use the Read tool" not "read the file somehow"
- Parallelize independent operations: "Read both files in parallel"
- Use sub-agents (Agent tool) for parallel research or large generation tasks
- See [tool-calls.md](../../references/clankgster-context-engineering-tool-calls.md)

---

## Good/bad examples

### Skill description

<examples>
<example type="good">
description: >-
  Generate conventional commit messages from staged git diffs. Analyzes
  change type (feat, fix, refactor), extracts scope from file paths,
  and writes subject + body. Use when committing staged changes, writing
  commit messages, or asking "what should I commit?"
</example>
<example type="bad">
description: Helps with git commits
</example>
</examples>

### Rule structure

<examples>
<example type="good">
# File naming in plugin content directories

**Purpose:** Prefix files with the plugin name to prevent collisions when
plugins are mixed or synced.

## Rule

In `rules/`, `commands/`, `skills/`, `agents/` — prefix each file name
with the plugin name and a hyphen.

## Good

`clankgster-sync-writing-conventions.md`

## Bad

`writing-conventions.md` — collides if another plugin has the same name
</example>
<example type="bad">

## Naming

Name your files well. Use descriptive names. Make sure they're unique.
Don't use bad names. Names should be good.
</example>
</examples>

### Reference organization

<examples>
<example type="good">
# Prompt techniques for AI coding agents

## Table of contents

1. Positive over negative instructions
2. XML tags in markdown
3. Emphasis techniques
...

## Positive over negative instructions

Tell agents what TO do, not what to avoid.

[Good/bad example pair]
[Why this works]
</example>
<example type="bad">

## Stuff about prompts

Here is everything about prompts. Prompts are important. You should
write good prompts. There are many ways to write prompts...

[500 lines of unsectioned prose]
</example>
</examples>

---

## Cross-references

- [Prompt techniques](../../references/clankgster-context-engineering-prompt-techniques.md) — XML tags, emphasis, checklists, conditional breaks, sub-agents, tool requests
- [Writing descriptions](../../references/clankgster-context-engineering-writing-descriptions.md) — description field best practices, testing, examples
- [Tool calls](../../references/clankgster-context-engineering-tool-calls.md) — complete tool reference for Claude Code, Cursor, Codex
- [Progressive disclosure](../../references/clankgster-context-engineering-progressive-disclosure.md) — loading model, layer design, common mistakes
- [Content type decision tree](../../docs/clankgster-context-engineering-content-type-decision-tree.md) — "I have content X → which type?"
- [Content type comparison matrix](../../docs/clankgster-context-engineering-content-type-comparison-matrix.md) — exhaustive feature comparison
