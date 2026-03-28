# Invocation and triggering

How each content type gets activated: user-initiated slash commands, agent-initiated auto-invocation, and the trigger mechanisms that control when content enters the conversation.

---

## User-invocable (slash commands)

**Skills** are user-invocable by default. The user types `/skill-name` and the agent loads and executes the skill body. Skills appear in the slash menu alongside commands.

**Commands** are also user-invocable via `/command-name`. Commands are the legacy equivalent of skills for simple workflows. They appear in the slash menu the same way.

**Rules, references, docs, and agents** are not user-invocable via slash commands. Rules apply automatically. References and docs are read manually or via links. Agents are spawned by the agent runtime, not by user slash invocation.

## Auto-invocable (agent decides)

**Skills** can be auto-invoked when the agent determines that the user's request matches a skill's description. The agent reads skill descriptions from the catalog and selects the best match. This is why the `description` field in skill frontmatter is critical: it is the primary signal the agent uses for auto-matching.

**Rules** are auto-applied by nature. Always-on rules are injected without any decision. **Cursor** often uses `globs` and `description` on `.mdc` rules for conditional loading. **Claude Code** uses **`paths`** (glob patterns) in `.claude/rules/*.md` YAML frontmatter for path-scoped rules, per [path-specific rules](https://code.claude.com/docs/en/memory#path-specific-rules).

**Commands** are never auto-invoked. They require explicit user `/` invocation. This is one key behavioral difference between commands and skills.

**References, docs, and agents** are not auto-invocable. References are passive (pulled by links). Docs require explicit reads. Agents are spawned programmatically.

## Disabling auto-invocation

**Skills** support `disable-model-invocation: true` in their YAML frontmatter. When set, the agent will not auto-select the skill based on description matching. The skill remains available via explicit `/skill-name` invocation. This is useful for skills that should only run when the user deliberately requests them (e.g., destructive operations, publishing workflows).

**Rules** can disable always-on behavior in Cursor by setting `alwaysApply: false` in the `.mdc` frontmatter, which makes the rule conditional (`globs` / `description`) rather than always-on. In Claude Code, use **`paths`** on `.claude/rules/*.md` to scope a rule to matching files; rules **without** `paths` remain session-wide. Restructuring into another content type is only needed when rules are the wrong abstraction.

Commands, references, docs, and agents do not have auto-invocation to disable.

## Hiding from the slash menu

**Skills** support `user-invocable: false` in their frontmatter. When set, the skill is **not user-invokable** via slash (per [Claude Code skills](https://code.claude.com/docs/en/skills#control-who-invokes-a-skill)); the agent may still auto-invoke it when appropriate. This is useful for skills that should run as background automations, not as user-facing commands.

**Commands** cannot be hidden from the slash menu. If a command file exists in `commands/`, it appears.

Other content types do not appear in slash menus and this setting is not applicable.

## Trigger mechanisms

Each content type has a distinct trigger mechanism:

| Type      | Trigger                                | Who triggers it         |
| --------- | -------------------------------------- | ----------------------- |
| Skill     | Description match or user `/`          | Agent or user           |
| Rule      | File globs, description, or always-on  | Agent runtime           |
| Command   | User `/` only                          | User only               |
| Reference | Link from active content               | Agent (following links) |
| Doc       | Explicit instruction to read           | User or agent           |
| Agent     | Sub-agent spawn                        | Agent runtime           |

**Skills** have the most flexible triggering: both user-initiated and agent-initiated paths. The description serves as a semantic trigger for auto-invocation, while the slash command serves as an explicit trigger.

**Rules** have the broadest automatic triggering. Always-on rules fire unconditionally. **Cursor** uses `globs` (and sometimes `description`) for conditional rules. **Claude Code** uses **`paths`** on `.claude/rules/*.md` for path-scoped rules. Description-matched rules (where supported) fire when the conversation topic matches.

**Commands** have the simplest trigger: the user types the slash command. No other path exists.

**References** are triggered indirectly. When a skill or rule body contains a link to a reference file, the agent may follow that link and load the reference. The reference itself has no trigger mechanism.

**Docs** require someone to explicitly instruct the agent to read the file, or the agent decides to read it during exploration. There is no automatic trigger.

**Agents** are spawned by the agent runtime when the system determines a sub-agent is needed. The spawn mechanism varies by platform.

---

*Parent: [Content type comparison matrix](../references/common-content-type-comparison-matrix.md)*
