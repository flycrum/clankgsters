# Write effective rules

**Purpose:** Conventions for writing plugin rule files that agents consume reliably.

## Rule

Use rules for conventions and constraints, not multi-step workflows.

## Structure

Every rule should include:

1. H1 title
2. `Purpose` line
3. `Rule` section
4. `When it applies` and optionally `When it does not apply`

## Naming

Plugin-name file prefixes are recommended for disambiguation, but not universally required.

- Good: `common-write-rules.md`
- Also valid: `write-rules.md` (when collisions are impossible)

If files will be merged into shared locations, prefer disambiguating prefixes.

## Quality standards

- One concern per file
- Concrete wording and measurable expectations
- Positive instructions where possible
- Link to references for deep detail instead of inlining

## Cross-references

- [common-prompt-techniques.md](../references/common-prompt-techniques.md)
- [common-progressive-disclosure.md](../references/common-progressive-disclosure.md)
