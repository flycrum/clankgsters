# Prompt techniques for AI coding agent context

Shared reference for writing effective instructions in skills, rules, commands, and references that AI coding agents (Claude Code, Cursor, Codex) consume reliably.

---

## Table of contents

1. [Positive over negative instructions](#positive-over-negative-instructions)
2. [XML tags in markdown](#xml-tags-in-markdown)
3. [Emphasis and attention techniques](#emphasis-and-attention-techniques)
4. [Structuring checklists](#structuring-checklists)
5. [Step-by-step instructions](#step-by-step-instructions)
6. [Telling agents NOT to do something](#telling-agents-not-to-do-something)
7. [Token budget awareness](#token-budget-awareness)
8. [Good/bad examples](#goodbad-examples)

---

## Positive over negative instructions

Tell agents what TO do, not what to avoid. Positive framing gives the agent a clear action path. Negative framing leaves the agent guessing what the alternative should be.

<examples>
<example type="good">
Respond in plain prose paragraphs without bullet points or headers.
</example>
<example type="bad">
Do not use markdown formatting. Do not use bullet points. Do not use headers.
</example>
</examples>

When you must negate, pair the prohibition with the desired alternative:

```md
Do not use console.log for operational flow. Use clankLogger.getLogger().info() instead.
```

**Why this works:** LLMs process instructions as probability distributions. "Do X" concentrates probability on the desired output. "Don't do Y" suppresses Y but spreads probability across all alternatives.

---

## XML tags in markdown

XML tags provide unambiguous structure that agents parse reliably. Use them when your content mixes instructions, context, examples, and output format.

### When to use XML tags

- Separating instructions from context or examples within a single file
- Wrapping variable content that changes per invocation
- Defining output format the agent should produce
- Grouping related constraints or conditions

### When NOT to use XML tags

- Simple, linear prose that reads naturally as markdown
- Short rules (under 20 lines) where headings suffice
- Inside the SKILL.md `description` field (XML tags are prohibited there)

### Effective tag patterns

```xml
<instructions>
Write the commit message following conventional commits format.
</instructions>

<context>
The repository uses Angular-style commit prefixes: feat, fix, refactor, docs.
</context>

<examples>
<example type="good">
feat(auth): add OAuth2 token refresh flow
</example>
<example type="bad">
updated auth stuff
</example>
</examples>

<output_format>
Return the commit message as a single code block, no explanation.
</output_format>

<constraints>
- Subject line under 72 characters
- Body wraps at 80 characters
- Reference issue IDs when available
</constraints>
```

### Nesting and hierarchy

Nest tags when content has a natural parent-child relationship.

```xml
<workflow>
  <step name="analyze">Read the diff and identify change themes.</step>
  <step name="draft">Write the commit subject line.</step>
  <step name="verify">Confirm the subject matches the actual changes.</step>
</workflow>
```

### Tag naming conventions

- Use lowercase, descriptive names: `<instructions>`, `<context>`, `<examples>`
- Use consistent tag names across files in the same plugin
- Avoid generic names like `<data>` or `<info>` — be specific
- **Multi-word tag names:** Use underscores as separators: `<output_format>`, `<commit_message>`, `<file_naming_rules>`. Do not use hyphens (`<output-format>`) — some XML parsers treat hyphens differently, and underscores are the established convention in Anthropic's own prompting examples
- Attributes use the same convention: `<example type="good">`, `<step name="analyze">`

---

## Emphasis and attention techniques

### What works

| Technique | Use for | Example |
| ----------- | --------- | --------- |
| **Bold** | Key terms, critical constraints | **Do not push to main** |
| Headings (##) | Section boundaries, scan targets | `## Pre-checks` |
| `STOP` keyword | Hard workflow breaks | **STOP** if no staged files exist |
| Numbered lists | Sequential steps | `1. Read the diff` |
| Tables | Structured comparisons | Decision matrices |

### What to use sparingly

| Technique | Risk | Guidance |
| ----------- | ------ | ---------- |
| ALL CAPS sentences | Overtriggers on Claude 4.6; model may over-weight the instruction | Reserve for 1-2 truly critical guard rails per file |
| Exclamation marks | Can read as urgency, may cause over-correction | Use in genuine stop conditions only |
| `CRITICAL` / `IMPORTANT` | Claude 4.6 already weights system prompt instructions heavily | One per file maximum; prefer clear phrasing over urgency labels |
| Repeated instructions | Wastes tokens, can cause the agent to fixate | State once, clearly |

### Claude 4.6 calibration note

---

## Structuring checklists

Checklists help agents track progress through multi-step verification. They are especially effective at the end of a workflow (post-creation verification) or as acceptance criteria.

### Effective checklist format

```markdown
## Verification checklist

- [ ] Descriptions are 1-1024 characters, third person
- [ ] No inferable content remains
- [ ] Cross-reference paths resolve correctly
- [ ] Each file is under its length limit
```

### Guidelines

- Place checklists at the **end** of a workflow section, not the beginning
- Each item should be independently verifiable (agent can check it without context from other items)
- Use concrete, measurable criteria — "descriptions are under 1024 characters" beats "descriptions are reasonable"
- Limit to 5-10 items; longer checklists lose agent attention on later items
- Prefix with "Copy this checklist and track your progress" for multi-step tasks if you want the agent to actively track completion

---

## Step-by-step instructions

### Numbered vs bulleted

- **Numbered lists** for sequential steps that must happen in order
- **Bullet lists** for parallel options or unordered considerations

### Structure

Each step should contain:

1. **Action verb** — what to do (Read, Write, Run, Verify)
2. **Target** — what to act on (file path, tool name, data)
3. **Success criteria** — how to know this step is done (optional but helpful for complex steps)

```markdown
1. Read the staged diff using `git diff --cached`
2. Identify the primary change type (feat, fix, refactor, docs)
3. Write the subject line: `type(scope): [ID] description`
4. Verify the subject line is under 72 characters
```

### Avoid

- Steps that combine multiple independent actions (split them)
- Steps with no clear verb ("The configuration should be...")
- Implicit ordering where order matters ("Also do X" — use numbered steps instead)

---

## Telling agents NOT to do something

This is a common need but frequently done poorly. The most effective patterns, in order of preference:

### 1. Positive alternative (best)

Instead of prohibiting, state what to do instead.

<examples>
<example type="good">
Write files to `.clank/plugins/` only. The sync system handles `.cursor/` and `.claude/` directories.
</example>
<example type="bad">
NEVER write to `.cursor/` or `.claude/` directories! NEVER EVER modify these directories manually! This is EXTREMELY IMPORTANT!
</example>
</examples>

### 2. Brief prohibition with reason

When you must negate, be brief and explain why.

```markdown
Do not use `git commit --amend` after a hook failure — it modifies the previous commit, not the failed one.
```

### 3. Scope exclusion

Define what is in scope and what is not.

```markdown
## Scope
This skill writes plugin content files (skills, rules, references).

## Out of scope
- Agent-specific configuration files (.cursor/settings.json, .claude/settings.json)
- Build tooling or CI/CD configuration
- Application source code
```

### What to avoid in prohibitions

- Repetition of the same prohibition in multiple forms ("Don't X. Never X. Do not ever X.")
- Emotional language ("This is extremely dangerous!")
- Vague prohibitions without alternatives ("Don't do anything bad")
- ALL CAPS paragraphs of prohibitions (agent may over-correct and become too cautious)

---

## Token budget awareness

Every token in a skill, rule, or reference competes for attention in the agent's context window.

### Budget guidelines

| Content type | Budget | Notes |
| --- | --- | --- |
| SKILL.md description | ~100 tokens | Loaded at startup for ALL skills |
| SKILL.md body | <5,000 tokens | Loaded on invocation |
| References | Variable | Loaded only when linked from active content |
| Rules | <2,000 tokens | Loaded based on context/always-on |
| Docs | 0 (not auto-loaded) | Agent reads only when explicitly told |

### Techniques for staying in budget

- Cut what the model already knows (standard language features, common patterns)
- Use references for detail; keep the orchestrating file lean
- One concept per rule; combine related concepts only when they are always relevant together
- Challenge each paragraph: "Does the agent need this to produce the right output?"
- Front-load the most important information (agents may truncate or lose focus on later content)

---

## Good/bad examples

### Instruction clarity

<examples>
<example type="good">
Read the file at `src/config.ts` using the Read tool. Extract the `baseUrl` value.
</example>
<example type="bad">
Look at the config and find the URL thing.
</example>
</examples>

### Workflow structure

<examples>
<example type="good">
1. Run `git diff --cached` to see staged changes
2. Classify the primary change type (feat, fix, refactor)
3. Write the subject line following the template: `type(scope): description`

**STOP** if no staged changes exist. Inform the user.
</example>
<example type="bad">
Check the git diff and then write a commit message. Make sure it's good. Don't forget to check if there are staged changes first (this is really important!!!).
</example>
</examples>

### Scope definition

<examples>
<example type="good">
## Scope
For plugin content files under `.clank/plugins/`. Applies when creating or editing skills, rules, references, and docs.

## Out of scope

Application source code, CI/CD configuration, agent-specific config files.
</example>
<example type="bad">
This is for writing stuff. Don't use it for other things.
</example>
</examples>
