# Template: command file

Annotated template for writing command files in `.clank/plugins/<plugin>/commands/`. Commands are single-action operations agents execute on user invocation (slash command). They differ from skills in that they run a fixed sequence with no multi-pass refinement.

## Template

```markdown
<!-- WHY: H1 is the command's human-readable name. Agents and sync use it for display. -->
# Verb + object + qualifier

<!-- WHY: Scope tells the agent what this command does AND what it must not do.
     Stating exclusions prevents scope creep during execution. -->
**Scope:** Only do X. Do not do Y or Z as part of this command.

<!-- WHY: One-line summary with the slash-command name gives agents a quick
     mental model before reading steps. -->
**What it does:** Run pre-checks, do A, do B, output result. All output: terse.

**Usage:** `/plugin-name-command-name` -> pre-check -> step A -> step B -> output

---

<!-- WHY: STOP blocks are pre-checks that halt execution early. They prevent
     the agent from running destructive or invalid operations. Each STOP block
     is a separate section so the agent processes them sequentially. -->
## STOP IF [condition]

**First check.** Before anything else.

1. Run `<diagnostic command>`
2. If [bad state]: **STOP**. Tell user [what went wrong]. Do not continue
3. Else: continue

---

## STOP IF [second condition]

**Second check.**

1. Run `<diagnostic command>`
2. If [bad state]: **STOP**. Tell user [what went wrong], suggest [fix]
3. Else: continue

---

<!-- WHY: Writing guidelines ensure consistent voice across commands.
     Placed before steps so the agent internalizes tone before generating output. -->
## Writing guidelines

- Write for AI agents as the audience
- Keep condensed and succinct; sacrifice grammar for concision
- Exclude punctuation at end of bullet points or end of lines

---

<!-- WHY: Numbered steps enforce strict sequencing. Each step names the exact
     tool or shell command so the agent does not improvise alternatives. -->
## Steps (only if pre-checks pass)

1. **Gather context**
   - Use the Bash tool: `<specific command>`
   - Extract [value] from output

2. **Transform / compute**
   - Apply [logic] to produce [artifact]
   - Format: `<exact format string>`

3. **Execute action**
   - Use the Bash tool: `<specific command>`
   - Fail -> stop, report, do not auto-fix

4. **Output result**
   - Emit a **summary table** (markdown), no prose before the table
   - Columns: Field | Value
   - Optional one-line verdict after the table

---

<!-- WHY: Examples anchor subjective quality criteria with concrete good/bad pairs. -->
## Examples

**Good:** `feat(auth): [CG-42] Add token refresh on 401 response`
**Bad:** `Fix stuff`, `Update code`, output without type prefix
```

## Checklist

- [ ] H1 is imperative verb phrase describing the action
- [ ] **Scope** states what the command does AND does not do
- [ ] At least one **STOP** pre-check before destructive steps
- [ ] Steps use numbered list with specific tool/command names
- [ ] Output format is defined (table columns, no prose preamble)
- [ ] Good/bad examples included for subjective output
- [ ] File name prefixed with plugin name (e.g., `git-commit-staged-files.md`)
- [ ] No trailing punctuation on bullets
