# Content type comparison matrix

Exhaustive feature comparison of all plugin content types. Use this to understand the differences, trade-offs, and capabilities of each type.

---

## Primary comparison matrix

| Feature              | Skill                                | Rule                    | Command                  | Reference                      | Doc                  | Agent             |
| -------------------- | ------------------------------------ | ----------------------- | ------------------------ | ------------------------------ | -------------------- | ----------------- |
| **Purpose**          | Multi-step workflow                  | Convention / constraint | Simple workflow (legacy) | Shared detail for skills/rules | Background knowledge | Sub-agent persona |
| **Primary file**     | `SKILL.md`                           | `<name>.md`             | `<name>.md`              | `<name>.md`                    | `<name>.md`          | `<name>.md`       |
| **Directory**        | `skills/<name>/`                     | `rules/`                | `commands/`              | `references/`                  | `docs/`              | `agents/`         |
| **Has subdirectory** | Yes (skill dir)                      | No                      | No                       | No                             | No                   | No                |
| **Supporting files** | `references/`, `scripts/`, `assets/` | None                    | None                     | None                           | None                 | None              |

---

## [Loading and context behavior](clankgster-context-engineering-matrix-loading-behavior.md)

| Feature                          | Skill                          | Rule                               | Command   | Reference                       | Doc                  | Agent     |
| -------------------------------- | ------------------------------ | ---------------------------------- | --------- | ------------------------------- | -------------------- | --------- |
| **Auto-loaded at startup**       | Description only (~100 tokens) | Yes (always-on) or conditional [^1] | No        | No                              | No                   | No        |
| **Loaded on invocation**         | Full body                      | N/A (already loaded or contextual) | Full body | N/A                             | N/A                  | Full body |
| **Loaded on demand**             | N/A                            | N/A                                | N/A       | When linked from active content | When explicitly read | N/A       |
| **Context window cost (idle)**   | ~100 tokens (description)      | Full file (if always-on)           | 0         | 0                               | 0                    | 0         |
| **Context window cost (active)** | Full body + referenced files   | Already loaded                     | Full body | Full file                       | Full file            | Full body |
| **Progressive disclosure**       | Yes (3 layers) [^2]            | Partial (contextual rules) [^3]    | No        | Yes (on-demand)                 | No (all or nothing)  | No        |

[^1]: In Claude Code, rules in `.claude/rules/` are always-on by default. In Cursor, the `alwaysApply` frontmatter field controls this: `true` means always-on, `false` means conditional (triggered by `globs` or `description` match). In Codex, rules in `AGENTS.md` are always loaded for the directory scope they appear in.

[^2]: Skills have three progressive disclosure layers: (1) description loaded at startup for discovery (~100 tokens), (2) full `SKILL.md` body loaded on invocation, (3) `references/` files loaded on demand when the skill body links to them. This keeps idle cost minimal while making full depth available.

[^3]: Always-on rules have no progressive disclosure (fully loaded from session start). Conditional rules add one layer: not loaded until the glob or description trigger fires, then fully loaded. Cursor's `.mdc` format supports this natively via `alwaysApply: false`; Claude Code rules are always-on unless restructured into a different content type.

---

## [Invocation and triggering](clankgster-context-engineering-matrix-invocation-triggering.md)


| Feature                            | Skill                                  | Rule                                     | Command       | Reference                | Doc                  | Agent           |
| ---------------------------------- | -------------------------------------- | ---------------------------------------- | ------------- | ------------------------ | -------------------- | --------------- |
| **User-invocable (slash /)**       | Yes (default)                          | No                                       | Yes           | No                       | No                   | No              |
| **Auto-invocable (agent decides)** | Yes (via description match) [^4]       | Yes (always-on or contextual)            | No            | No                       | No                   | No              |
| **Can disable auto-invocation**    | Yes (`disable-model-invocation: true`) [^5] | Yes (set `alwaysApply: false` in Cursor) [^6] | N/A           | N/A                      | N/A                  | N/A             |
| **Can hide from slash menu**       | Yes (`user-invocable: false`)          | N/A                                      | No            | N/A                      | N/A                  | N/A             |
| **Trigger mechanism**              | Description match or user `/`          | File globs, description, or always-on    | User `/` only | Link from active content | Explicit instruction | Sub-agent spawn |

[^4]: The agent reads skill descriptions from its catalog and selects the best match for the user's request. The `description` field in skill frontmatter is the primary signal. A poor or vague description degrades auto-matching quality. This behavior is consistent across Claude Code, Cursor, and Codex.

[^5]: `disable-model-invocation: true` in skill YAML frontmatter prevents the agent from auto-selecting the skill via description matching. The skill remains available for explicit `/skill-name` invocation. Use this for destructive, publishing, or otherwise sensitive workflows that should only run when deliberately requested.

[^6]: In Cursor, `alwaysApply: false` makes a rule conditional (activated by `globs` or `description` match). In Claude Code, rules in `.claude/rules/` are always-on with no built-in toggle; conditional behavior requires restructuring (e.g., moving guidance into a skill or reference). Codex rules in `AGENTS.md` are always loaded for their directory scope.

---

## [Metadata and frontmatter](clankgster-context-engineering-matrix-metadata-frontmatter.md)


| Feature                        | Skill                               | Rule                               | Command  | Reference     | Doc | Agent               |
| ------------------------------ | ----------------------------------- | ---------------------------------- | -------- | ------------- | --- | ------------------- |
| **Has YAML frontmatter**       | Yes (required for name/description) | Optional [^7]                      | Optional | No (standard) | No  | Yes                 |
| **`name` field**               | Yes (1-64 chars, kebab-case)        | No                                 | No       | No            | No  | Yes                 |
| **`description` field**        | Yes (1-1024 chars, critical) [^8]   | Optional (for contextual matching) | Optional | No            | No  | Optional            |
| **`allowed-tools`**            | Yes [^9]                            | No                                 | No       | No            | No  | Yes [^9]            |
| **`model` override**           | Yes                                 | No                                 | No       | No            | No  | Yes                 |
| **`effort` level**             | Yes [^10]                           | No                                 | No       | No            | No  | Yes [^10]           |
| **`context: fork`**            | Yes [^11]                           | No                                 | No       | No            | No  | N/A (always forked) [^12] |
| **`hooks`**                    | Yes (scoped to skill lifecycle)     | No                                 | No       | No            | No  | No                  |
| **`paths` (glob activation)**  | Yes                                 | Via `.mdc` `globs` (Cursor) [^13]  | No       | No            | No  | No                  |
| **`argument-hint`**            | Yes                                 | No                                 | No       | No            | No  | No                  |
| **`disable-model-invocation`** | Yes [^5]                            | No                                 | No       | No            | No  | No                  |
| **`user-invocable`**           | Yes                                 | No                                 | No       | No            | No  | No                  |
| **`shell`**                    | Yes                                 | No                                 | No       | No            | No  | No                  |

[^7]: In Cursor, `.mdc` rules require frontmatter with `alwaysApply`, `globs`, and/or `description`. In Claude Code, `.md` rules do not require frontmatter. Clankgster sync writes agent-agnostic `.md` rules and transforms them to `.mdc` with appropriate frontmatter for Cursor.

[^8]: The `description` field is the most important field in a skill file. It controls auto-discovery: the agent reads descriptions from the skill catalog and matches them against the user's request. A poor description means missed auto-invocations. Maximum 1,024 characters; state what the skill does, when to use it, and what inputs it expects.

[^9]: `allowed-tools` restricts which tools (Bash, Read, Write, Edit, Grep, Glob, etc.) the skill or agent can call during execution. When set, only listed tools are available. This acts as a security and scope boundary: a read-only skill can be restricted to `Read` and `Grep`, preventing accidental writes or shell commands. Example: `allowed-tools: [Read, Grep, Glob]`.

[^10]: `effort` controls the reasoning effort the agent applies. Common values: `low`, `medium`, `high`. In Claude, this maps to the `reasoning_effort` parameter controlling how deeply the model reasons before responding. Low effort is faster and cheaper; high effort is slower but more thorough. Useful for distinguishing quick lookups from deep analysis tasks.

[^11]: `context: fork` executes the skill in an isolated context separate from the main conversation. The skill cannot see the full conversation history, and the conversation cannot see the skill's intermediate steps. Only the final output crosses the boundary. Use this for skills that generate heavy intermediate output or need a clean working context.

[^12]: Agents are always forked by design. Sub-agents inherently run in their own isolated context with their own persona, tools, and conversation state. The `context: fork` field is not needed because forking is the default behavior.

[^13]: In Cursor's `.mdc` format, the `globs` frontmatter field specifies file patterns that activate the rule (e.g., `globs: ["*.ts", "*.tsx"]`). Claude Code does not natively support glob-based rule activation in `.claude/rules/`; all rules there are always-on. The `paths` field on skills serves a similar purpose but for skill auto-invocation rather than rule activation.

---

## [Content guidelines](clankgster-context-engineering-matrix-content-guidelines.md)

| Feature                     | Skill                     | Rule                       | Command      | Reference                   | Doc      | Agent             |
| --------------------------- | ------------------------- | -------------------------- | ------------ | --------------------------- | -------- | ----------------- |
| **Recommended max lines**   | 500                       | 200 (preferred), 500 (max) | 50           | No hard limit (TOC if >100) | No limit | 200               |
| **Recommended max tokens**  | 5,000 (body)              | 2,000                      | 1,000        | Variable                    | No limit | 2,000             |
| **Description max chars**   | 1,024                     | N/A                        | N/A          | N/A                         | N/A      | N/A               |
| **Contains workflow steps** | Yes (primary purpose)     | No (state conventions)     | Yes (simple) | No (detail/reference)       | No       | No (persona only) |
| **Contains examples**       | Yes (good/bad pairs)      | Yes (good/bad pairs)       | Optional     | Yes (detailed)              | Yes      | No                |
| **Contains checklists**     | Yes (verification)        | Optional                   | No           | Optional                    | Optional | No                |
| **Cross-references others** | Yes (links to references) | Yes (links to references)  | Rarely       | Yes (links to other refs)   | Optional | Rarely            |

---

## [Naming and organization](clankgster-context-engineering-matrix-naming-organization.md)

| Feature                    | Skill                             | Rule                              | Command                           | Reference                    | Doc                   | Agent                |
| -------------------------- | --------------------------------- | --------------------------------- | --------------------------------- | ---------------------------- | --------------------- | -------------------- |
| **Naming convention**      | Gerund preferred (processing-X)   | Plugin-prefix + descriptive       | Plugin-prefix + descriptive       | Plugin-prefix + topic        | Plugin-prefix + topic | Plugin-prefix + role |
| **Plugin name prefix**     | Folder name prefixed              | File name prefixed                | File name prefixed                | File name prefixed           | File name prefixed    | File name prefixed   |
| **Uniqueness requirement** | Must be unique across all plugins | Must be unique across all plugins | Must be unique across all plugins | Descriptive (linked by path) | Descriptive           | Must be unique       |
| **Sync namespacing**       | `plugin:skill-name`               | Symlinked to agent dirs           | Symlinked to agent dirs           | Not synced directly          | Not synced            | Symlinked            |

---

## [Cross-agent support](clankgster-context-engineering-matrix-cross-agent-support.md)

| Feature                    | Skill                  | Rule                       | Command               | Reference             | Doc         | Agent        |
| -------------------------- | ---------------------- | -------------------------- | --------------------- | --------------------- | ----------- | ------------ |
| **Claude Code**            | Full support           | Full support               | Full support (legacy) | Via skill references/ | Manual read | Full support |
| **Cursor**                 | Full support           | Full support (.mdc native) [^14] | Partial [^15]         | Via skill references/ | Manual read | Partial [^16] |
| **Codex**                  | Full support           | Via AGENTS.md [^17]        | Partial [^15]         | Via skill references/ | Manual read | Limited [^18] |
| **Agent Skills standard**  | Core spec              | Not in spec [^19]          | Not in spec           | In spec (optional)    | Not in spec | Not in spec  |
| **Portable across agents** | Yes (core frontmatter) | Partially (format varies) [^20] | Partially             | Yes                   | Yes         | Partially    |

[^14]: Cursor uses `.mdc` as its native rule format with `alwaysApply`, `globs`, and `description` frontmatter fields. Clankgster sync transforms agent-agnostic `.md` rules into `.mdc` format. Cursor's glob-based conditional rules are more granular than Claude Code's always-on rules.

[^15]: Command support in Cursor and Codex covers basic slash-command invocation but may not support all features available in Claude Code. Simple commands work; complex ones with tool restrictions or hooks may need adaptation.

[^16]: Cursor has its own agent/composer mechanisms that do not fully align with the `agents/` content type format. Sub-agent spawning and persona isolation may behave differently than in Claude Code.

[^17]: Codex uses `AGENTS.md` files as its rule mechanism. Rules must be placed in or referenced from `AGENTS.md` at the appropriate directory level. Codex does not read `.claude/rules/` or `.mdc` files. Clankgster sync can generate `AGENTS.md` content from plugin rules.

[^18]: Codex's sub-agent capabilities are more constrained than Claude Code's. The `agents/` content type may not map cleanly to Codex's execution model, and features like `allowed-tools`, `model` override, and `context: fork` may not be supported.

[^19]: Rules are not part of the Agent Skills standard because each agent platform has its own rules mechanism (`.claude/rules/`, `.mdc`, `AGENTS.md`). The format and loading behavior differ too much to standardize. This is the primary motivation for Clankgster sync's rule transformation.

[^20]: Rule portability is the biggest cross-agent gap. Claude Code uses `.md` files in `.claude/rules/` (always-on). Cursor uses `.mdc` files with conditional triggers. Codex uses `AGENTS.md` with directory scoping. Clankgster sync bridges this by writing rules once in agent-agnostic `.md` and transforming to each agent's native format.

---

## When to use (summary)

| Type          | Use when...                                                          | Do NOT use when...                                                  |
| ------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Skill**     | You have a multi-step workflow with clear inputs and outputs         | The content is a simple convention with no execution steps          |
| **Rule**      | You have a convention, constraint, or guideline agents should follow | The content is a workflow requiring numbered steps and verification |
| **Command**   | You need a simple workflow under 30 lines (legacy; prefer skills)    | The workflow is complex or needs supporting files                   |
| **Reference** | You have detailed material shared by multiple skills or rules        | The content stands alone and nothing links to it                    |
| **Doc**       | You have background research, reports, or archival content           | The content should influence agent behavior automatically           |
| **Agent**     | You need a specialized sub-agent with its own persona and tools      | The behavior is a workflow that runs in the main agent context      |

---

## Decision shortcuts

- "Agents should always follow this" -> **Rule** (always-on)
- "Agents should follow this for .ts files" -> **Rule** (glob-matched)
- "User types /something to run a workflow" -> **Skill**
- "Agent should auto-detect when to run this" -> **Skill** (description-matched)
- "Multiple skills reference this guide" -> **Reference**
- "I want to read this but agents do not need it" -> **Doc**
- "Run this code when an event happens" -> **Hook**
- "Connect to an external tool" -> **MCP**

<!-- AUDIT: Verify all [^N] references have matching footnotes and vice versa -->
