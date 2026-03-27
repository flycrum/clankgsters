# Deep research report: context engineering for AI coding agents

Comprehensive findings from research into skills, rules, plugins, prompt engineering, and cross-agent compatibility for AI coding agents. This report covers the current state of the art as of March 2026.

---

## Table of contents

1. [Agent Skills open standard](#agent-skills-open-standard)
2. [ETH Zurich findings on instruction effectiveness](#eth-zurich-findings-on-instruction-effectiveness)
3. [Claude 4.6 behavior and calibration](#claude-46-behavior-and-calibration)
4. [Anthropic context engineering guidance](#anthropic-context-engineering-guidance)
5. [SKILL.md specification details](#skillmd-specification-details)
6. [Cross-agent compatibility](#cross-agent-compatibility)
7. [Prompt engineering research compilation](#prompt-engineering-research-compilation)
8. [XML in markdown effectiveness](#xml-in-markdown-effectiveness)
9. [Progressive disclosure mechanics](#progressive-disclosure-mechanics)
10. [File length empirical findings](#file-length-empirical-findings)
11. [Description field research](#description-field-research)
12. [Plugin organization patterns](#plugin-organization-patterns)
13. [Sources](#sources)

---

## Agent Skills open standard

Published by Anthropic at [agentskills.io](https://agentskills.io) in December 2025. Now adopted by 26+ platforms including:

- Claude Code (Anthropic)
- OpenAI Codex
- Gemini CLI (Google)
- GitHub Copilot
- Cursor
- VS Code
- JetBrains IDEs

### Core specification

A skill is a directory containing at minimum a `SKILL.md` file:

```md
skill-name/
  SKILL.md          # Required: instructions + metadata
  scripts/          # Optional: executable code
  references/       # Optional: documentation
  assets/           # Optional: templates, resources
```

### Frontmatter fields (spec)

| Field | Required | Constraints |
| --- | --- | --- |
| `name` | Yes | Max 64 chars, lowercase + numbers + hyphens, no leading/trailing/consecutive hyphens, must match directory name |
| `description` | Yes | Max 1024 chars, non-empty |
| `license` | No | License name or reference |
| `compatibility` | No | Max 500 chars |
| `metadata` | No | String-to-string key-value map |
| `allowed-tools` | No | Space-delimited list (experimental) |

### Agent-specific extensions

Extensions are safely ignored by agents that do not support them:

**Claude Code extensions:** `context`, `agent`, `hooks`, `argument-hint`, `user-invocable`, `model`, `effort`, `disable-model-invocation`, `paths`, `shell`

**Cursor extensions:** `license`, `compatibility`, `metadata`

**Codex extensions:** `interface` (via `agents/openai.yaml`), `policy`

### Token budgets

| Layer | Approximate tokens |
| --- | --- |
| Metadata (name + description) | ~100 tokens |
| Full SKILL.md body | <5,000 tokens recommended |
| Supporting files | Loaded only as needed |

---

## ETH Zurich findings on instruction effectiveness

Source: [InfoQ coverage, March 2026](https://www.infoq.com/news/2026/03/agents-context-file-value-review/)

### Key finding

LLM-generated context files (auto-generated AGENTS.md, rules) may often **hinder** AI coding agent performance rather than help. The study found that:

1. **Auto-generated context** can introduce noise, contradictions, or overly generic guidance that the model already knows
2. **Human-written instructions** are most effective when limited to **non-inferable details** — things the model genuinely cannot figure out from the code
3. **Highly specific tooling details** (custom build commands, non-standard workflows, project-specific conventions) are the most valuable context

### Recommendations

- Omit LLM-generated context files entirely unless manually reviewed and curated
- Limit human-written instructions to genuinely non-inferable details
- Less is genuinely more — every additional instruction competes for attention
- Test with and without context to measure actual impact

### Implications for this plugin

- Every rule, skill, and reference should pass the "non-inferable" test: does the agent genuinely need this information to produce correct output?
- Standard coding practices (naming conventions, formatting) that the model already follows do not need rules
- Custom workflows, project-specific tools, and non-obvious conventions are the highest-value content

---

## Claude 4.6 behavior and calibration

Source: [Anthropic prompting best practices](https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering)

### Behavioral changes from previous models

1. **More proactive** — Claude 4.6 does significantly more upfront exploration and may take initiative without being asked
2. **May overtrigger** — Instructions that needed aggressive emphasis on previous models now trigger too aggressively
3. **Strong sub-agent preference** — Claude 4.6 has a predilection for spawning sub-agents; may need guidance about when they are/aren't warranted
4. **Adaptive thinking** — Replaces manual `budget_tokens` configuration with automatic calibration
5. **More responsive to system prompt** — System prompt instructions carry more weight than in previous generations

### Calibration guidance

| Previous pattern | Recommended pattern for 4.6 |
| --- | --- |
| "CRITICAL: You MUST use this tool when..." | "Use this tool when..." |
| "NEVER EVER do X under any circumstances" | "Do not X" |
| "It is EXTREMELY IMPORTANT that you..." | "Ensure that..." |
| Multiple repeated emphasis | State once, clearly |

### Sub-agent guidance for 4.6

Claude 4.6 will spawn sub-agents more readily than previous models. When writing skills:

- Explicitly state when sub-agents are appropriate ("Use the Agent tool for parallel research")
- Explicitly state when they are not ("Do not use sub-agents for simple file reads")
- The model responds well to clear criteria rather than blanket rules

---

## Anthropic context engineering guidance

Source: [Anthropic Engineering Blog](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

### Core principles

1. **Altitude calibration** — System prompts need the "Goldilocks zone": specific enough to guide behavior, flexible enough for the model's own heuristics to work
2. **Just-in-time context** — Maintain lightweight identifiers and dynamically load data at runtime rather than pre-loading everything into the context window
3. **Sub-agent architecture** — Specialized sub-agents with clean context windows returning condensed summaries (1,000-2,000 tokens)
4. **Compaction strategy** — When conversations approach context limits, summarize while preserving architectural decisions and discarding redundant tool outputs
5. **Structured note-taking** — Agents maintaining external notes (NOTES.md, to-do lists) as persistent memory outside the context window

### Practical recommendations

- **Find the smallest set of high-signal tokens** that maximize the likelihood of your desired outcome
- **Progressive disclosure** — load context only when needed, not all at once
- **Feedback loops** — build validation steps that catch errors before they propagate
- **Rules of thumb for sub-agents:** return 1,000-2,000 token summaries; avoid giving sub-agents the full parent context

---

## SKILL.md specification details

### Name field validation (complete rules)

- 1-64 characters
- Lowercase alphanumeric + hyphens only
- Cannot start or end with hyphen
- Cannot contain consecutive hyphens (`--`)
- Must match the parent directory name
- Cannot contain XML tags
- Cannot contain reserved words: "anthropic", "claude"

### String substitutions available in skills

| Variable | Description |
| --- | --- |
| `$ARGUMENTS` | All arguments passed when invoking |
| `$ARGUMENTS[N]` / `$N` | Specific argument by 0-based index |
| `${CLAUDE_SESSION_ID}` | Current session ID |
| `${CLAUDE_SKILL_DIR}` | Directory containing the skill's SKILL.md |
| `${CLAUDE_PLUGIN_ROOT}` | Absolute path to plugin's installation directory |
| `${CLAUDE_PLUGIN_DATA}` | Persistent directory for plugin state |

### Dynamic context injection

The `` !`<command>` `` syntax runs shell commands during skill preprocessing. Output replaces the placeholder before content is sent to the agent. This is preprocessing, not runtime execution.

### Skill storage locations (precedence)

| Location | Path | Scope |
| --- | --- | --- |
| Enterprise | Managed settings | All org users |
| Personal | `~/.claude/skills/<name>/SKILL.md` | All your projects |
| Project | `.claude/skills/<name>/SKILL.md` | This project |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Where plugin enabled |

Priority: enterprise > personal > project. Plugin skills are namespaced and cannot conflict.

### Naming recommendations

Use **gerund form** (verb + -ing) for skill names:

- Good: `processing-pdfs`, `analyzing-spreadsheets`, `testing-code`
- Acceptable: `pdf-processing`, `process-pdfs`
- Avoid: `helper`, `utils`, `tools`, `documents`

---

## Cross-agent compatibility

### Skill discovery paths

| Agent | Primary path | Secondary paths |
| --- | --- | --- |
| Claude Code | `.claude/skills/` | Plugin skills (namespaced) |
| Cursor | `.cursor/skills/`, `.agents/skills/` | Plugin skills |
| Codex | `.agents/skills/` | Parent dirs, `$HOME/.agents/skills`, `/etc/codex/skills` |

### Rule formats

| Agent | Format | Location |
| --- | --- | --- |
| Claude Code | `.md` (via plugins, synced) | `.claude/rules/` |
| Cursor | `.md` or `.mdc` (with YAML frontmatter) | `.cursor/rules/` |
| Codex | AGENTS.md (standard markdown) | Any directory (nearest to edited file wins) |

### Context file hierarchy

| Agent | Root context file |
| --- | --- |
| Claude Code | `CLAUDE.md` (also reads `AGENTS.md`) |
| Cursor | `.cursorrules` (also reads `AGENTS.md`) |
| Codex | `AGENTS.md` (primary) |

### Shared vs agent-specific features

| Feature | Shared | Claude-only | Cursor-only | Codex-only |
| --- | --- | --- | --- | --- |
| SKILL.md | Yes | — | — | — |
| `name` frontmatter | Yes | — | — | — |
| `description` frontmatter | Yes | — | — | — |
| `allowed-tools` | Experimental | Full support | — | — |
| `context: fork` | — | Yes | — | — |
| `disable-model-invocation` | — | Yes | — | — |
| `user-invocable` | — | Yes | — | — |
| `model` override | — | Yes | — | — |
| `effort` | — | Yes | — | — |
| `hooks` (skill-scoped) | — | Yes | — | — |
| `paths` (glob activation) | — | Yes | — | — |
| `.mdc` with `globs` | — | — | Yes | — |
| `alwaysApply` | — | — | Yes | — |
| AGENTS.md hierarchy | — | — | — | Yes |
| Sandbox modes | — | — | — | Yes |

---

## Prompt engineering research compilation

### Instruction adherence curve

Research consistently shows diminishing returns as instruction count increases. The most effective instruction files have:

- **6-10 rules** for root context (CLAUDE.md/AGENTS.md)
- **3-5 command references** for common workflows
- Individual rule files under **200 lines** for best adherence

### Positive vs negative framing

LLMs process positive instructions more reliably than negative ones. The probability distribution explanation:

- "Write in plain prose" → concentrates probability on prose output
- "Don't use markdown" → suppresses markdown but spreads probability across all other formats

In practice, combine: "Write in plain prose. Do not use bullet points or headers."

### Context placement effects

| Position | Effect |
|---|---|
| System prompt (first) | Highest adherence, but can be overridden by conversation |
| Early in conversation | High adherence |
| Middle of conversation | Moderate adherence; may be lost in compaction |
| Late in conversation | Lower adherence; competing with accumulated context |

For skills and rules, critical instructions should appear in the first 1/3 of the file.

### Repetition effects

Stating the same instruction twice can increase adherence, but:

- Three or more repetitions show diminishing returns
- Exact repetition is less effective than rephrasing
- Over-repetition can cause the model to fixate, applying the rule too aggressively

### Chain-of-thought in instructions

Explaining WHY a rule exists improves adherence more than demanding compliance:

- "Use relative paths (absolute paths break in CI environments)" is more effective than "ALWAYS use relative paths"
- The model applies the rule more accurately when it understands the constraint

---

## XML in markdown effectiveness

### When XML tags help

1. **Mixed content types** — Instructions alongside examples alongside context. Tags disambiguate.
2. **Template outputs** — When the skill needs the agent to produce structured output.
3. **Variable injection** — Wrapping user-provided content in tags prevents prompt injection.
4. **Nested examples** — `<example type="good">` and `<example type="bad">` clearly separate example types.

### When XML tags do NOT help

1. **Short files** — Under 20 lines of content, headings are sufficient.
2. **Linear prose** — Narrative instructions that read naturally as markdown.
3. **Description fields** — XML tags are prohibited in SKILL.md descriptions.

### Agent processing of XML

- **Claude:** Processes XML tags natively; uses them for structural parsing. Has first-class support in the system prompt.
- **Cursor:** Processes XML via the underlying model (Claude or GPT); not natively parsed.
- **Codex:** Processes XML through the model; no special handling.

### Effective tag patterns

```xml
<instructions>Action steps the agent should follow</instructions>
<context>Background information for the task</context>
<examples><example type="good">...</example><example type="bad">...</example></examples>
<output_format>Expected output structure</output_format>
<constraints>Hard limits and boundaries</constraints>
<workflow><step name="X">...</step></workflow>
```

### Tag naming conventions

- Lowercase, descriptive names
- Consistent across files in the same plugin
- Avoid generic (`<data>`, `<info>`) — be specific (`<commit_format>`, `<naming_rules>`)

---

## Progressive disclosure mechanics

### How agents discover skills

1. **At session start:** Agent loads ALL skill names + descriptions from enabled plugins and project/personal skill directories
2. **On user message:** Agent matches the user's request against loaded descriptions
3. **Best match:** Agent selects the skill with the highest relevance score
4. **Body load:** Full SKILL.md body is loaded into context
5. **Reference load:** As the agent follows links, referenced files are loaded on demand

### Description budget mechanics

The total description budget is calculated as:

- **2% of context window** (e.g., 200K context → 4,000 characters)
- **Fallback:** 16,000 characters if context window is unknown
- **Override:** `SLASH_COMMAND_TOOL_CHAR_BUDGET` environment variable

If total descriptions exceed the budget, skills are truncated or dropped. This makes concise descriptions a shared resource priority.

### Compaction behavior

When conversations approach context limits, Claude Code compacts by:

1. Summarizing tool call results (keeping decisions, discarding raw output)
2. Preserving architectural decisions and user preferences
3. Retaining active skill context (the skill body stays)
4. Dropping earlier conversation turns

Skills should be self-contained enough that compaction of earlier turns does not break the workflow.

---

## File length empirical findings

### Observed patterns in effective plugins

| Content type | Effective range | Ceiling |
| --- | --- | --- |
| SKILL.md body | 50-300 lines | 500 lines |
| Rule file | 30-100 lines | 200 lines (prefer), 500 (max) |
| Command file | 20-50 lines | 100 lines |
| Reference file | 50-200 lines | No hard limit (TOC if >100) |
| Doc file | Any | No limit |
| Plugin README | 20-60 lines | 100 lines |
| Root CLAUDE.md | 10-50 lines | 150 lines |

### The "less is more" evidence

- ETH Zurich: auto-generated context files with 200+ instructions performed worse than no context
- Anthropic's CLANK.md guidance: "6-10 rules and 3-5 command references; longer files see diminishing returns"
- Practical observation: skills under 200 lines have higher completion rates than those over 400

### Character counts for descriptions

| Quality tier | Character range | Example |
| --- | --- | --- |
| Too short | <50 chars | "Helps with plugins" |
| Minimum viable | 50-150 chars | "Generate commit messages from staged git diffs" |
| Good | 150-500 chars | Includes what + when + triggers |
| Optimal | 300-700 chars | Includes what + when + triggers + scope boundaries |
| Too long | >800 chars | Competing with other descriptions for budget |

---

## Description field research

### Why descriptions fail

From Anthropic's skill authoring guidance: "If a skill does not trigger, it is almost never the instructions — it is the description."

Common failure modes:

| Failure | Example | Fix |
| --- | --- | --- |
| Too vague | "Helps with files" | "Extract text and tables from PDF files..." |
| Wrong voice | "I help you process..." | "Processes Excel files and generates..." |
| No triggers | "Database migration tool" | "...Use when creating migrations or modifying schema" |
| Implementation details | "Uses Prisma internally to..." | Focus on what the user sees, not how it works |
| No scope boundaries | Matches too many requests | Add "Does not handle X" for common confusions |

### Description as a "mini-prompt"

Think of the description as a classifier prompt. It must:

1. **Match** the right user requests (recall)
2. **Reject** unrelated requests (precision)
3. **Win** over competing skill descriptions (ranking)

The best descriptions optimize all three.

---

## Plugin organization patterns

### Flat vs deep

**Flat pattern** (recommended for <5 skills):

```md
plugin/
  skills/skill-a/SKILL.md
  skills/skill-b/SKILL.md
  rules/rule-a.md
  references/ref-a.md
```

**Deep pattern** (for larger plugins):

```md
plugin/
  skills/skill-a/
    SKILL.md
    references/skill-specific-ref.md
    scripts/helper.sh
  skills/skill-b/SKILL.md
  references/shared-ref.md   # Used by multiple skills
  rules/rule-a.md
  docs/deep-dive.md           # Background reading
```

### Cross-referencing pattern

- Skills link to plugin-level `references/` for shared content
- Skills link to their own `references/` for skill-specific content
- Rules link to plugin-level `references/` for detailed guidance
- Nothing links to `docs/` — it is opt-in reading
- All cross-references use relative paths

### README as index

The plugin README serves as a human-readable index:

- One-line purpose
- Layout section listing all content with brief descriptions
- After-change instructions (run sync)
- Not used by agents for discovery (plugin.json handles that)

### The scripts/ directory

The `scripts/` directory is a standard plugin directory documented in the [Claude Code plugins reference](https://code.claude.com/docs/en/plugins-reference). It serves two purposes:

1. **Hook scripts** — executable files referenced from `hooks/hooks.json`. Hooks fire on specific events (PreToolUse, PostToolUse, Stop, etc.) and run deterministic code, not AI instructions
2. **Utility scripts** — helper scripts used by skills via the `` !`<command>` `` dynamic context injection syntax, or called via the Bash tool during skill execution

The `scripts/` directory can exist at both plugin level and skill level:

- Plugin-level: `<plugin>/scripts/` — shared across all skills
- Skill-level: `<plugin>/skills/<skill>/scripts/` — specific to one skill

Environment variables available in hook scripts:

- `${CLAUDE_PLUGIN_ROOT}` — absolute path to the plugin directory
- `${CLAUDE_PLUGIN_DATA}` — persistent data directory for plugin state

---

## Sources

- [Agent Skills Standard — agentskills.io](https://agentskills.io)
- [Agent Skills Specification](https://agentskills.io/specification)
- [Agent Skills Best Practices — Anthropic](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- [Claude Code Plugins Reference](https://code.claude.com/docs/en/plugins-reference)
- [Claude Code Tools Reference](https://code.claude.com/docs/en/tools-reference)
- [Anthropic Prompting Best Practices](https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering)
- [Effective Context Engineering — Anthropic Engineering Blog](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Context Engineering for Coding Agents — Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html)
- [Cursor Rules Documentation](https://cursor.com/docs/context/rules)
- [Codex AGENTS.md Guide](https://developers.openai.com/codex/guides/agents-md)
- [Codex Skills](https://developers.openai.com/codex/skills)
- [ETH Zurich AGENTS.md Research — InfoQ, March 2026](https://www.infoq.com/news/2026/03/agents-context-file-value-review/)
- [Anthropic Skills GitHub Repository](https://github.com/anthropics/skills)
- [Claude Code Plugin Dev Skill](https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/skill-development/SKILL.md)
- [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [How to Write a Good Spec for AI Agents — Addy Osmani](https://addyosmani.com/blog/good-spec/)
- [Context Engineering Guide — Vibehackers](https://vibehackers.io/blog/context-engineering-guide)
