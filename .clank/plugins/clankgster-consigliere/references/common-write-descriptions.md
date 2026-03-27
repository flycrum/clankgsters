# Write effective description fields

The `description` field in SKILL.md frontmatter is the single most important field for skill discoverability. It controls whether an AI agent auto-invokes the skill — if a skill does not trigger, the problem is almost always the description, not the instructions.

---

## Table of contents

1. [How descriptions work](#how-descriptions-work)
2. [Constraints](#constraints)
3. [Writing voice](#write-voice)
4. [Structure pattern](#structure-pattern)
5. [Trigger phrases](#trigger-phrases)
6. [Scope boundaries](#scope-boundaries)
7. [Keyword density](#keyword-density)
8. [Good/bad examples](#goodbad-examples)
9. [Testing your description](#testing-your-description)

---

## How descriptions work

Descriptions participate in **progressive disclosure**:

| Phase | What loads | Token cost |
| ------- | ----------- | ------------ |
| Startup | name + description for ALL enabled skills | ~100 tokens per skill |
| Invocation | Full SKILL.md body | <5,000 tokens |
| Deep reference | Supporting files (references/, scripts/) | Variable |

The agent reads ALL skill descriptions at the start of every session. It uses them to decide which skill to load when a user request arrives. A vague description means the agent either (a) never triggers the skill, or (b) triggers it for the wrong requests.

### Context budget

The total budget for all skill descriptions scales at **2% of the context window**, with a fallback of **16,000 characters**. If you have many skills, concise descriptions are not optional — they are a shared resource.

---

## Constraints

| Attribute | Requirement |
| ----------- | ------------- |
| Length | 1-1,024 characters |
| Format | Plain text (no markdown, no XML tags) |
| Required | Yes (technically optional but effectively required for discoverability) |
| Cannot contain | XML tags, markdown formatting |

---

## Writing voice

Writing in **third person**. The description is injected into the system prompt alongside many other skill descriptions. Inconsistent point-of-view causes the agent to misinterpret the description.

<examples>
<example type="good">
Processes Excel files and generates summary reports from tabular data.
</example>
<example type="bad">
I can help you process Excel files and generate reports.
</example>
<example type="bad">
You can use this to process Excel files and generate reports.
</example>
</examples>

---

## Structure pattern

A well-structured description has two parts:

1. **What it does** — the capability, in one sentence
2. **When to use it** — trigger conditions, in one sentence starting with "Use when..." or "Triggers —"

```md
<what it does>. <when to use it>.
```

### Template

```yaml
description: >-
  <Action verb> <what> from/into <target format/system>.
  Use when <user says X>, <context Y applies>, or <file pattern Z matches>.
```

---

## Trigger phrases

Include the exact phrases a user might type that should activate this skill. Front-load the most distinctive terms.

### Good trigger phrase patterns

- Action phrases: "write plugin content", "create a skill from this"
- Domain terms: "context engineer", "plugin authoring", "optimize for agents"
- File references: "SKILL.md", "rules file", "plugin references"
- Contextual situations: "after editing plugins", "when rules are not update"

### Placement

Put triggers after the capability description, using one of these formats:

```yaml
# Inline
description: >-
  Transform raw content into plugin files. Use when asked to
  "write plugin content", "create a skill", or "optimize for agents".

# Trigger list
description: >-
  Transform raw content into plugin files. Triggers — "write plugin
  content", "create a skill from this", "turn this into rules",
  "optimize for agents", plugin authoring.
```

---

## Scope boundaries

Include what the skill does NOT do when ambiguity is likely. This prevents false triggers.

```yaml
description: >-
  Generate commit messages from staged git diffs. Use when write
  commit messages or reviewing staged changes. Does not handle
  unstaged changes or branch management.
```

Only add negative boundaries when there is a realistic risk of confusion with another skill. Do not list every possible thing the skill does not do.

---

## Keyword density

Front-load distinctive terms. The agent processes descriptions left-to-right and assigns more weight to early terms.

<examples>
<example type="good">
Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
</example>
<example type="bad">
A helpful utility that can assist with various document-related tasks including but not limited to working with files in the PDF format.
</example>
</examples>

### Terms to include

- **Domain nouns** — the objects the skill operates on (PDFs, commits, plugins, configs)
- **Action verbs** — what the skill does (extract, generate, transform, analyze)
- **File extensions or patterns** — when relevant (.pdf, .xlsx, SKILL.md, rules/)
- **User intent phrases** — how users describe the need ("help me write", "create a", "optimize")

### Terms to avoid

- Generic qualifiers: "helpful", "useful", "powerful", "comprehensive"
- Internal jargon the user would not type
- Implementation details (tool names, internal functions)

---

## Good/bad examples

### Example 1: Plugin content skill

<examples>
<example type="good">
description: >-
  Transform raw content into optimized Clankgster plugin files — skills, rules,
  references, docs, README. Runs a 3-pass workflow: draft, refine, finalize.
  Writes frontmatter with high-signal descriptions, organizes for AI agent
  consumption, applies progressive disclosure. Triggers — "write plugin
  content", "create a skill from this", "turn this into rules", "optimize
  this for agents", "context engineer this", plugin authoring.
</example>
<example type="bad">
description: Helps write plugin content
</example>
</examples>

### Example 2: Code review skill

<examples>
<example type="good">
description: >-
  Review code changes for bugs, security issues, and style violations.
  Analyzes git diffs and provides actionable feedback with line references.
  Use when reviewing PRs, staged changes, or asking "is this code okay?"
</example>
<example type="bad">
description: Does code review
</example>
</examples>

### Example 3: Documentation voice skill

<examples>
<example type="good">
description: >-
  Playful robot doc voice (Solomon-adjacent) — science-minded, gently
  awkward, SFW, always clear. Use for human-centric markdown files like
  README.md, not technical documentation like agent-specific files.
</example>
<example type="bad">
description: Writing style for docs
</example>
</examples>

### Example 4: Database migration skill

<examples>
<example type="good">
description: >-
  Generate and validate database migration files for PostgreSQL using
  Prisma. Creates up/down migrations, checks for destructive operations,
  and validates against the current schema. Use when creating migrations,
  modifying database schema, or asking about migration safety.
</example>
<example type="bad">
description: Database migration helper tool for managing schema changes in the database system
</example>
</examples>

---

## Testing your description

1. **Trigger test** — Ask a colleague (or another AI session) to describe the task in 3 different ways. Does the description match all 3?
2. **Disambiguation test** — If you have 10 skills, would the agent pick the right one from the description alone?
3. **Negative test** — Think of 3 requests that should NOT trigger this skill. Does the description accidentally match any?
4. **Character count** — Confirm the description is under 1,024 characters
5. **Two-instance test** — Use one Claude session to refine the description, another to test whether it triggers correctly on real tasks
