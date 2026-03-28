# Skill workflows: prompt addendum

Patterns for **SKILL.md bodies** that orchestrate tools, branching, and sub-agents. Read [common-prompt-techniques.md](../../../references/common-prompt-techniques.md) first for shared guidance (framing, XML tags, checklists, steps, user input, scope, token budget).

---

## Conditional workflow breaks

Use conditional breaks to handle branching logic inside a skill workflow.

### Pattern 1: STOP conditions (hard breaks)

```markdown
**STOP** if no staged files exist. Report to the user and exit.
```

Use for precondition failures where the entire workflow should abort. Place at the top of the workflow or at the beginning of the relevant phase.

### Pattern 2: Branch conditions (soft forks)

```markdown
Determine the modification type:
- **Creating new content?** → Follow the "Creation workflow" section below
- **Editing existing content?** → Follow the "Editing workflow" section below
```

Use for workflow forks where different paths apply based on context. Place at the decision point, not at the top.

### Pattern 3: Early returns from steps

```markdown
3. Check for existing tests
   - If tests exist and pass → skip to step 6
   - If tests exist and fail → fix them in step 4
   - If no tests exist → create them in step 4
```

---

## Requesting sub-agents

Sub-agents (the `Agent` tool in Claude Code) run tasks in isolated context windows, keeping the primary conversation lean.

### When to request sub-agents

- **Parallel research** — exploring multiple parts of a codebase simultaneously
- **Large file generation** — when the output would consume significant context
- **Isolated validation** — running tests or checks without cluttering the main window
- **Multi-area changes** — modifications spanning unrelated parts of the codebase

### When NOT to request sub-agents

- Simple file reads or edits (use Read/Edit directly)
- Tasks requiring conversational context the sub-agent would not have
- Sequential work where each step depends on the previous

### How to request in a skill

```markdown
Use the Agent tool to explore the codebase for existing implementations.
Set subagent_type to "Explore" for codebase search tasks.
Set subagent_type to "Plan" for architectural design tasks.

Launch up to 3 agents in parallel when researching independent areas.
```

### Sub-agent output guidance

Request condensed summaries (1,000-2,000 tokens) from sub-agents. Full outputs consume context window budget in the parent conversation.

### Example: sub-agent prompt in a skill

```markdown
Use the Agent tool to verify all cross-references in the plugin. Provide this prompt:

"Scan all files under `.clank/plugins/<plugin>/`. For each relative markdown
link—bracketed visible text followed by a parenthesized path—verify the target
file exists. Return a table:

| Source file | Link text | Target path | Status |
| --- | --- | --- | --- |
| ... | ... | ... | Valid / Broken |

Report only broken links. If all links are valid, say 'All links valid.'"

Set `subagent_type` to `"Explore"` (read-only codebase search).
```

---

## Requesting specific tools

When a skill workflow requires specific tools, name them explicitly. This helps agents select the right tool instead of guessing.

```markdown
Use the Read tool to read the file contents.
Use the Glob tool to find files matching the pattern.
Use the Grep tool to search for the function definition.
Use the Edit tool to make the targeted replacement.
Use the Write tool to create the new file.
```

Avoid vague references like "search for the file" — specify which search tool (Glob for file patterns, Grep for content search).

See [common-tool-calls.md](../../../references/common-tool-calls.md) for tool names, permission syntax, and cross-platform notes.
