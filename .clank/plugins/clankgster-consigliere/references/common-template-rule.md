# Template: rule file

Annotated template for writing rule files in `.clank/plugins/<plugin>/rules/`. Rules are conventions and constraints agents follow automatically (always-on or contextually matched). They are not multi-step workflows — use skills for those.

## Template

```markdown
<!-- WHY: H1 is the rule's identity. Make it specific enough to distinguish
     from other rules at a glance. "File naming in plugin dirs" beats "Naming". -->
# Specific descriptive rule title

<!-- WHY: Purpose line gives the agent the "why" in one sentence. Rules with
     reasoning ("prefix to avoid collision") get higher adherence than bare
     mandates ("prefix files"). -->
**Purpose:** One sentence explaining what this rule enforces and why it matters.

<!-- WHY: The Rule section states the convention in positive framing. Agents
     follow "Do X" more reliably than "Don't do Y". When negation is needed,
     pair it with the desired alternative. -->
## Rule

State the convention clearly using positive framing. Tell the agent what TO do.

When a negative boundary is needed, pair with the alternative:
"Use relative paths (absolute paths break in CI environments)."

<!-- WHY: Scope boundaries prevent over-application. Without these, agents may
     apply a formatting rule to test files or a code rule to documentation. -->
## When it applies

- Context A (e.g., editing files in `rules/`, `commands/`, `skills/`)
- Context B (e.g., creating new plugin content)

## When it does not apply

- Exception A — and why (e.g., `README.md` and `plugin.json` are standard names)
- Exception B — and why

<!-- WHY: Good/bad example pairs are the highest-signal content in a rule.
     Agents pattern-match from examples more reliably than from prose.
     Keep examples 3-5 lines each. XML tags distinguish examples from
     surrounding instructions. -->
<examples>
<example type="good">
`clankgster-sync-write-conventions.md` — plugin prefix + descriptive name
</example>
<example type="bad">
`write-conventions.md` — collides if another plugin has the same topic
</example>
</examples>

<!-- WHY: Link to references for detailed techniques instead of inlining.
     Keeps the rule lean (under 200 lines) and avoids duplicating content
     that multiple rules share. -->
## References

For detailed guidance, see [reference-name](../references/plugin-name-reference.md).
```

## Checklist

- [ ] H1 is specific and descriptive (not generic like "Naming" or "Style")
- [ ] **Purpose:** line explains both what and why in one sentence
- [ ] Rule section uses positive framing ("Do X" over "Don't Y")
- [ ] Negations are paired with desired alternatives
- [ ] "When it applies" and "When it does not" sections define scope
- [ ] At least one good/bad example pair with XML tags
- [ ] Examples are 3-5 lines each, concrete and specific
- [ ] Under 200 lines preferred, 500 lines max
- [ ] File name prefixed with plugin name
- [ ] One concern per file (no multi-topic rules)
- [ ] No multi-step workflows (those belong in skills)
