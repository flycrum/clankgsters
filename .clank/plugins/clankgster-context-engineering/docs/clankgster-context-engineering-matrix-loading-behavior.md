# Loading and context behavior

How each content type enters the agent's context window, what it costs in tokens, and how progressive disclosure works.

---

## Auto-loaded at startup

**Skills** load only their description at startup (roughly 100 tokens). The agent sees a short summary in its skill catalog and can decide whether to invoke the full body later. This keeps idle cost low while still allowing the agent to discover the skill by description match.

**Rules** are the primary always-on content type. An always-on rule (the default for Claude Code) is injected into the context window at session start and stays there for the entire conversation. Conditional rules (glob-matched or description-matched) load only when the agent touches a matching file or topic. In Cursor, `alwaysApply: true` in the `.mdc` frontmatter controls this; in Codex, rules live in `AGENTS.md` and are always loaded for that directory scope.

**Commands, references, docs, and agents** are never auto-loaded. They contribute zero tokens at idle.

## Loaded on invocation

When the user invokes a **skill** (via `/skill-name` or when the agent auto-selects it), the full `SKILL.md` body is loaded into context. Any files in the skill's `references/` directory may also be pulled in if the skill body links to them.

**Commands** behave similarly: the full `.md` body loads when the user types the slash command. Commands are simpler and shorter, so the load is typically small.

**Agents** load their full persona file when spawned as a sub-agent. The sub-agent then operates in a forked context with that persona active.

**Rules** that are already loaded (always-on) do not re-load; conditional rules load when their trigger fires. References and docs are not invocation-based.

## Loaded on demand

**References** load when an active skill or rule links to them. For example, a skill body might contain `[see details](../../references/some-reference.md)`, and the agent reads that file when it follows the link. References never load on their own.

**Docs** load only when someone (user or agent) explicitly reads the file. They are background knowledge and archival content, not wired into any automatic loading mechanism.

Skills, rules, commands, and agents do not have an on-demand loading mode separate from their invocation or auto-load behavior.

## Context window cost at idle

| Type      | Idle cost             | Notes                                        |
| --------- | --------------------- | -------------------------------------------- |
| Skill     | ~100 tokens           | Description only, from skill catalog         |
| Rule      | Full file or 0        | Always-on rules cost their full size; conditional rules cost 0 until triggered |
| Command   | 0                     | Not loaded until invoked                     |
| Reference | 0                     | Not loaded until linked content pulls it in  |
| Doc       | 0                     | Not loaded until explicitly read             |
| Agent     | 0                     | Not loaded until spawned                     |

## Context window cost when active

**Skills** have the highest potential cost: the full `SKILL.md` body plus any referenced files the agent reads during execution. A well-structured skill keeps its body under 5,000 tokens, but referenced files can add more.

**Rules** that are always-on have already paid their cost at startup. The active cost equals the idle cost. Conditional rules pay their full file size when triggered.

**Commands** load their full body (typically under 1,000 tokens, given the 50-line recommendation).

**References** and **docs** load their full file content. References tend to be structured detail; docs can be arbitrarily long.

**Agents** load their full persona body into the sub-agent's forked context.

## Progressive disclosure

Progressive disclosure means the content type reveals information in layers rather than all at once.

**Skills** have three layers of progressive disclosure:

1. **Description** -- loaded at startup, used for discovery and auto-matching (~100 tokens)
2. **Body** -- loaded on invocation, contains the full workflow steps
3. **References** -- loaded on demand when the skill body links to them

This three-layer approach keeps idle costs low while making the full depth available when needed.

**Rules** have partial progressive disclosure through conditional (glob-matched or description-matched) rules. Always-on rules have no disclosure layers; they are fully loaded from the start. Conditional rules add one layer: not loaded until the trigger fires, then fully loaded.

**References** are inherently on-demand (one layer of disclosure), but they lack their own discovery mechanism. They depend entirely on links from skills or rules.

**Commands, docs, and agents** have no progressive disclosure. Commands and agents are all-or-nothing on invocation. Docs are all-or-nothing on explicit read.

---

*Parent: [Content type comparison matrix](clankgster-context-engineering-content-type-comparison-matrix.md)*
