# Writing effective rules

**Purpose:** Conventions for writing rule files in `.clank/plugins/<plugin>/rules/` that AI coding agents consume reliably.

## What rules are

Rules are conventions, constraints, and guidelines that agents follow during a session. They are loaded automatically (always-on or contextually matched) — the agent does not need to invoke them.

Use rules for things agents should **always follow** or **follow when relevant**, not for multi-step workflows (use skills for those).

## Format

- `.md` files in plugin `rules/` directories
- Sync handles agent-specific conversion (e.g., `.mdc` with frontmatter for Cursor)
- Write in agent-agnostic markdown; do not add `.mdc` frontmatter in plugin sources

## Structure

Every rule file should have:

1. **Title** (H1) — clear, descriptive
2. **Purpose line** — one sentence explaining what this rule does and why
3. **Rule section** — the actual convention or constraint
4. **When it applies / When it does not** — scope boundaries (optional but recommended for non-obvious scope)

### Template

```markdown
# Rule title

**Purpose:** One sentence explaining the rule and why it exists.

## Rule

State the convention clearly. Use positive framing ("Do X") over negative ("Don't do Y").
When you must negate, pair with the desired alternative.

## When it applies

- Context A
- Context B

## When it does not apply

- Exception A (and why)
```

## Length

- Preferred: under 200 lines
- Maximum: 500 lines
- If a rule exceeds 200 lines, consider splitting into a brief rule + detailed reference

## Naming

Prefix every rule file with the plugin name:

- `clankgster-plugins-guide-writing-rules.md`
- `git-no-commit-from-inferred-intent.md`
- `pino-logger-logging.md`

## Quality standards

- **One concern per file** — a rule about commit messages and a rule about file naming are two separate files
- **No workflow steps** — if the rule describes a multi-step process, it belongs in a skill (the rule can state the convention and link to the skill)
- **Composable** — rules should work independently; do not assume another rule is loaded
- **Concrete** — "File names must be prefixed with the plugin name" beats "Use good naming conventions"
- **Measurable when possible** — "Under 500 lines" beats "Keep files short"

## Good/bad examples

<examples>
<example type="good">
**Purpose:** Prefix plugin content files with the plugin name to avoid collisions.

## Rule

In rules/, commands/, skills/, agents/ — prefix each file name with the plugin name and a hyphen.

## Good

`clankgster-sync-writing-conventions.md`

## Bad

`writing-conventions.md`
</example>
<example type="bad">
Make sure to name your files well. Files should have good names that describe what they do. Don't use bad names.
</example>
</examples>

## Linking to references

When a rule needs detailed supporting material, link to a reference file rather than inlining the detail:

```markdown
For detailed prompt engineering techniques, see [prompt-techniques.md](../references/clankgster-plugins-guide-prompt-techniques.md).
```

This keeps rules lean and focused while making detail available on demand. See [progressive-disclosure.md](../references/clankgster-plugins-guide-progressive-disclosure.md) for how agents load linked content.
