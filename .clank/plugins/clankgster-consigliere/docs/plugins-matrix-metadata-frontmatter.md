# Metadata and frontmatter

YAML frontmatter fields available to each content type, what they control, and how they differ across agents.

---

## YAML frontmatter support

**Skills** require YAML frontmatter. The `name` and `description` fields are mandatory. Without frontmatter, a skill file will not be discovered or cataloged correctly.

**Rules** have optional frontmatter. In Cursor's `.mdc` format, frontmatter controls `alwaysApply`, `globs`, and `description`. In Claude Code, rules in `.claude/rules/` do not require frontmatter (the file name and content are sufficient). Clankgster sync writes agent-agnostic `.md` rules and transforms them to `.mdc` with appropriate frontmatter for Cursor.

**Commands** have optional frontmatter. A `description` can help users understand the command in the slash menu, but it is not required.

**References** and **docs** do not use frontmatter. They are plain markdown files consumed by content, not by the agent runtime.

**Agents** require frontmatter with at least a `name` field to identify the sub-agent.

## name field

The `name` field identifies the content type in the agent's catalog and slash menu.

- **Skills**: Required. 1-64 characters, kebab-case (e.g., `process-pull-request`, `debug-test-failure`). This becomes the slash command name.
- **Agents**: Required. Identifies the sub-agent for spawning and logging.
- All other types: Not applicable. Rules, commands, and references derive their identity from the file name or path.

## description field

The `description` field is the most important field for skills. It serves as the semantic matching signal when the agent decides whether to auto-invoke a skill.

- **Skills**: Required. 1-1,024 characters. Should clearly state what the skill does, when to use it, and what inputs it expects. A poor description means the agent will not match the skill correctly. This is the primary discovery mechanism.
- **Rules**: Optional. When present, enables description-based contextual matching (the agent loads the rule when the conversation topic matches). Without a description, the rule must be always-on or glob-matched.
- **Commands**: Optional. Shown in the slash menu to help users understand the command.
- **Agents**: Optional. Can help the runtime decide when to spawn the sub-agent.

## allowed-tools

The `allowed-tools` field restricts which tools (Bash, Read, Write, Edit, etc.) the skill or agent can use during execution.

- **Skills**: Supported. Accepts a list of tool names. When set, the skill can only call the listed tools. This is a security and scope boundary: a skill that only needs to read files can be restricted to `Read` and `Grep`, preventing accidental writes or shell commands.
- **Agents**: Supported. Same behavior as skills but scoped to the sub-agent's tool access.
- All other types: Not applicable.

Example:

```yaml
allowed-tools:
  - Read
  - Grep
  - Glob
```

## model override

The `model` field lets a skill or agent request a specific model for execution.

- **Skills**: Supported. The agent runtime may honor this to use a faster or more capable model for the skill's task.
- **Agents**: Supported. Sub-agents can run on a different model than the parent.
- All other types: Not applicable.

## effort level

The `effort` field controls the reasoning effort the agent should apply. This maps to different behavior depending on the agent runtime.

- **Skills**: Supported. Common values include `low`, `medium`, `high`. A `low` effort skill might use a lighter model or shorter reasoning chain. A `high` effort skill gets the full reasoning budget.
- **Agents**: Supported. Same semantics as skills.
- All other types: Not applicable.

In Claude, effort levels correspond to the `reasoning_effort` parameter, which controls how deeply the model thinks before responding. Low effort is faster and cheaper; high effort is slower but more thorough.

## context: fork

The `context: fork` field tells the agent runtime to execute the skill in a forked (isolated) context rather than the main conversation context.

- **Skills**: Supported. When `context: fork` is set, the skill runs in a separate context that does not pollute the main conversation. The skill's output is summarized and returned to the main context. This is useful for skills that generate a lot of intermediate output or need a clean slate.
- **Agents**: Always forked by design. Sub-agents inherently run in their own context, so this field is not applicable (the behavior is implicit).
- All other types: Not applicable.

Forked context means the skill cannot see the full conversation history and the conversation cannot see the skill's intermediate steps. Only the final output crosses the boundary.

## hooks

The `hooks` field defines lifecycle hooks scoped to the skill's execution.

- **Skills**: Supported. Hooks can run scripts at specific points in the skill lifecycle (e.g., before execution, after completion). This enables validation, cleanup, or notification side effects.
- All other types: Not applicable.

## paths (glob activation)

The `paths` field specifies file glob patterns that trigger the skill when the agent operates on matching files.

- **Skills**: Supported in frontmatter. When the agent edits or reads a file matching the glob, the skill becomes a candidate for auto-invocation.
- **Rules**: In Cursor's `.mdc` format, the `globs` frontmatter field serves the same purpose. In Claude Code, glob-based rule activation is not natively supported in `.claude/rules/`.
- All other types: Not applicable.

## Other skill-specific fields

Several fields are exclusive to skills:

- **argument-hint**: A hint string shown to the user when they invoke the skill, suggesting what argument to provide (e.g., "PR number or URL").
- **disable-model-invocation**: When `true`, prevents the agent from auto-invoking the skill via description matching. The skill remains available via explicit `/` invocation only.
- **user-invocable**: When `false`, hides the skill from the slash menu. The skill can still be auto-invoked by the agent. Useful for background automation skills.
- **shell**: Specifies the shell environment for any script execution within the skill.

---

*Parent: [Content type comparison matrix](common-content-type-comparison-matrix.md)*
