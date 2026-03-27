# Template: SKILL.md file

Annotated template for writing `SKILL.md` files for both:

- standalone source pathway `skills/` (`.clank/skills/<name>/SKILL.md`)
- plugin skill directories (`.clank/plugins/<plugin>/skills/<name>/SKILL.md`)

Skills are multi-step workflows agents execute on invocation. The description field controls auto-discovery and is the most important part.

## Template

````markdown
<!-- WHY: YAML frontmatter is parsed by the plugin system at startup.
     The description loads every session (~100 tokens) for matching. -->
---
name: example-skill-name
description: >-
  Third person description of what this skill does. Analyzes X, transforms Y,
  and produces Z. Runs a multi-step workflow: gather, process, verify. Use
  when the user asks to "do X", "create Y from Z", or "optimize W for V".
  Does not handle A or B (use other-skill for those). 150-700 characters,
  plain text only, no XML tags, no markdown formatting.
---

<!-- WHY: H1 repeats the skill name for human readers and agents that
     render the body as markdown. -->
# Skill display name

<!-- WHY: Scope paragraph gives the agent a mental model of boundaries
     before it reads steps. Prevents scope creep. -->
## Scope

This skill produces [output type] from [input type]. All output goes to
[location]. It does not handle [excluded concern] — tell the user to
use [alternative] for that.

## Out of scope

<!-- WHY: Explicit exclusions reduce hallucinated steps. -->
- Application source code changes
- CI/CD pipeline configuration
- Running external services

---

<!-- WHY: STOP blocks are hard pre-checks. The agent must verify these
     conditions before starting the workflow. -->
## Pre-checks

**STOP** if [critical precondition is false]. Tell user [what to fix].

**STOP** if [second precondition is false]. Run `<diagnostic command>` first.

---

<!-- WHY: Numbered steps enforce sequential execution. Action verbs (Read,
     Write, Run, Verify) tell the agent exactly which tool to use. -->
## 1. Gather input

Accept content from one or more sources:

- **Direct text** in the conversation
- **File paths** — use the Read tool to read each file
- **URLs** — use the WebFetch tool to fetch each URL

If no content is provided, ask:

1. What content or topic?
2. Where should output go?

---

## 2. Analyze and classify

<!-- WHY: XML instruction tags signal "follow these rules" vs surrounding
     context that is informational. Improves adherence on complex logic. -->
<instructions>
For each piece of content, determine:

1. Is it [type A]? -> handle as [A]
2. Is it [type B]? -> handle as [B]
3. Is it a mix? -> split into appropriate types
</instructions>

---

## 3. Execute workflow

1. **Plan** — list each output file with type and purpose
2. **Draft** — write initial versions using the Write tool
3. **Refine** — re-read each file, apply quality checks

---

## 4. Verify

<!-- WHY: Concrete, measurable checklist items catch errors the agent
     can self-check before presenting results. -->
- [ ] All output files exist at expected paths
- [ ] No placeholder text remains
- [ ] Cross-reference links resolve correctly
- [ ] Output is under [N] lines per file

---

<!-- WHY: Cross-references point to detail the skill body intentionally
     omits (progressive disclosure). Agents follow links on demand. -->
## Cross-references

- [Detailed technique A](../../references/plugin-name-technique-a.md)
- [Detailed technique B](../../references/plugin-name-technique-b.md)
````

## Checklist

- [ ] YAML frontmatter has `name` (matches directory name, kebab-case, 1-64 chars)
- [ ] `description` is 150-700 characters, third person, plain text
- [ ] Description includes trigger phrases users would type
- [ ] Description includes scope boundaries for disambiguation
- [ ] Body has Scope, Pre-checks, numbered Steps, Verification
- [ ] Steps use action verbs and name specific tools
- [ ] Verification items are concrete and measurable
- [ ] Body is under 500 lines / 5,000 tokens
- [ ] Detailed techniques are in references, not inlined
- [ ] Directory name matches `name` field in frontmatter
