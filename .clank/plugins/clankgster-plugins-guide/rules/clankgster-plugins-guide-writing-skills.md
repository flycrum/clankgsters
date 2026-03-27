# Writing effective skills

**Purpose:** Conventions for writing SKILL.md files in `.clank/plugins/<plugin>/skills/<name>/` that AI coding agents discover and execute reliably.

## What skills are

Skills are actionable, multi-step workflows that agents execute when invoked (by user slash command or auto-match from the description). Skills are the primary mechanism for teaching agents new capabilities.

## SKILL.md structure

Every SKILL.md has two parts:

### 1. YAML frontmatter (metadata)

```yaml
---
name: skill-name-here
description: >-
  Action-oriented description of what the skill does. Include specific
  trigger phrases and scope boundaries. Write in third person.
---
```

### 2. Markdown body (instructions)

Recommended sections (in order):

1. **Scope** — what this skill does and when to use it (1-2 paragraphs)
2. **Pre-checks** — conditions that must be true before starting; use `**STOP** if...` for hard failures
3. **Steps** — numbered, sequential steps with clear action verbs
4. **Verification** — checklist to confirm the output is correct
5. **Examples** — good/bad pairs showing expected behavior (optional but recommended)
6. **Cross-references** — links to reference files for detailed techniques

## The description field

The description controls whether agents auto-invoke the skill. It is the most important field.

- 1-1,024 characters, plain text (no XML tags, no markdown)
- Write in **third person** ("Generates commit messages..." not "I generate...")
- Include **trigger phrases** — words users might type that should activate the skill
- Include **scope boundaries** — what the skill does NOT do, when disambiguation is needed
- Front-load distinctive terms

**Spend more time on the description than any other part of the SKILL.md.**

See [writing-descriptions.md](../references/clankgster-plugins-guide-writing-descriptions.md) for detailed guidance and examples.

## Length

- Body: under 500 lines / 5,000 tokens
- If a skill exceeds 300 lines, move detailed techniques to `references/` files and link to them
- The SKILL.md body is the "orchestrator" — it tells the agent WHAT to do; references tell it HOW

## Naming

- Skill directory names: **gerund form** preferred (`processing-pdfs`, `analyzing-data`, `writing-plugins-context`)
- 1-64 characters, lowercase alphanumeric + hyphens
- Must match the parent directory name
- Cannot contain "anthropic" or "claude" (reserved words)
- After sync, skill names are prefixed with plugin name: `plugin-name-skill-name`

## Progressive disclosure

Skills use three layers of progressive disclosure:

| Layer | What loads | When |
| --- | --- | --- |
| Description | ~100 tokens | Every session (startup) |
| SKILL.md body | <5,000 tokens | On invocation |
| References | Variable | On demand (agent follows link) |

Design accordingly:

- Description: "what" and "when"
- Body: "how" (steps, workflow)
- References: "detailed techniques" and "shared guidance"

See [progressive-disclosure.md](../references/clankgster-plugins-guide-progressive-disclosure.md) for the full loading model.

## Frontmatter fields reference

| Field | Default | Purpose |
| --- | --- | --- |
| `name` | Directory name | Display name (kebab-case) |
| `description` | None | Controls auto-invocation |
| `argument-hint` | None | Autocomplete hint (e.g., `[issue-number]`) |
| `disable-model-invocation` | `false` | `true` = user-only invocation |
| `user-invocable` | `true` | `false` = hidden from `/` menu |
| `allowed-tools` | None | Tools allowed without permission |
| `model` | Session default | Model override |
| `effort` | Session default | `low`, `medium`, `high`, `max` |
| `context` | Main | `fork` = run in sub-agent |
| `agent` | `general-purpose` | Sub-agent type when `context: fork` |
| `hooks` | None | Skill-scoped lifecycle hooks |
| `paths` | None | Glob patterns for auto-activation |
| `shell` | `bash` | `bash` or `powershell` |

## Quality standards

- Every skill should have a clear **scope** statement
- Every multi-step workflow should use **numbered steps** with action verbs
- Include a **verification checklist** for workflows that produce output
- Use **good/bad examples** for subjective quality criteria
- Link to references instead of inlining detailed guidance
- Test with real tasks before publishing
