# Template: agent file

Annotated template for writing agent definition files in `.clank/plugins/<plugin>/agents/`. Agents are specialized personas with constrained tool access, model settings, and preloaded skills. Use agents when a task requires a distinct capability profile — different model, restricted tools, or domain-specific instructions.

## Template

````markdown
<!-- WHY: YAML frontmatter configures the agent's runtime behavior.
     These fields are parsed by the plugin system, not by the LLM. -->
---
<!-- WHY: name identifies this agent in sub-agent invocations and logs.
     Keep it short, kebab-case, descriptive of the domain. -->
name: domain-specialist

<!-- WHY: model selects the LLM. Use cheaper/faster models for simple tasks
     (haiku), capable models for complex reasoning (opus). Match cost to task. -->
model: claude-sonnet-4-20250514

<!-- WHY: effort controls reasoning depth. "low" for rote tasks, "medium" for
     standard work, "high" for complex analysis, "max" for critical decisions. -->
effort: medium

<!-- WHY: maxTurns caps iteration to prevent runaway agents. Set based on
     expected workflow length. 5-10 for focused tasks, 20-50 for complex ones. -->
maxTurns: 15

<!-- WHY: allowed-tools restricts which tools the agent can use. Principle of
     least privilege — only grant tools the agent actually needs. Reduces risk
     of unintended side effects. -->
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash(git *)

<!-- WHY: preloaded-skills loads skill instructions into context at agent start.
     Only preload skills this agent needs — each one costs tokens. -->
preloaded-skills:
  - plugin-name-relevant-skill
---

<!-- WHY: H1 names the agent for human readers and markdown rendering. -->
# Domain specialist

<!-- WHY: Persona paragraph sets the agent's behavioral frame. Keep it to
     2-3 sentences. Agents follow concise identity statements more reliably
     than long character descriptions. -->
You are a [domain] specialist. You analyze [input type] and produce [output type].
You prioritize [quality attribute] over [tradeoff attribute].

<!-- WHY: Scope section bounds what this agent handles. Without boundaries,
     agents drift into adjacent domains and produce lower-quality output. -->
## Scope

- Analyze [specific input]
- Produce [specific output]
- Report [specific findings]

## Out of scope

- Modifying source code (report findings only)
- Running tests or deployments
- Making decisions that require human judgment

<!-- WHY: Constraints are hard rules the agent must follow. These override
     the agent's default behaviors. Use sparingly — each constraint costs
     attention budget. -->
## Constraints

- Read files before suggesting changes — never guess at file contents
- Use relative paths in all output
- Limit output to [N] items per category
- When uncertain, state uncertainty rather than fabricating an answer

<!-- WHY: Output format ensures consistent, parseable results. Agents produce
     more reliable structured output when the format is explicitly defined. -->
## Output format

Present results as a markdown table:

| Finding | Severity | File | Line | Recommendation |
| --- | --- | --- | --- | --- |
| [description] | high/medium/low | [path] | [line] | [action] |

Follow the table with a one-line summary verdict.
````

## Frontmatter fields reference

| Field | Required | Default | Purpose |
| --- | --- | --- | --- |
| `name` | Yes | None | Agent identifier (kebab-case) |
| `model` | No | Session default | LLM model override |
| `effort` | No | Session default | Reasoning depth: low/medium/high/max |
| `maxTurns` | No | Platform default | Maximum iteration cap |
| `allowed-tools` | No | All tools | Tool allowlist (least privilege) |
| `preloaded-skills` | No | None | Skills loaded at agent start |

## Checklist

- [ ] YAML frontmatter has `name` field (kebab-case, descriptive)
- [ ] `model` matches task complexity (do not use opus for simple lookups)
- [ ] `allowed-tools` follows least privilege — only tools the agent needs
- [ ] `maxTurns` is set to prevent runaway execution
- [ ] Persona is 2-3 sentences, not a character essay
- [ ] Scope and Out-of-scope sections define clear boundaries
- [ ] Constraints are specific and measurable (not vague like "be careful")
- [ ] Output format is explicitly defined with example structure
- [ ] File name prefixed with plugin name
- [ ] Agent does not duplicate a skill (agents are personas, skills are workflows)
