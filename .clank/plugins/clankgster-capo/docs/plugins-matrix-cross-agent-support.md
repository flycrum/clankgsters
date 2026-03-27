# Cross-agent support

How each content type works across Claude Code, Cursor, and Codex, and which types are part of the Agent Skills standard.

---

## Claude Code

Claude Code has the most complete support for all content types:

- **Skills**: Full support. Claude Code natively understands `SKILL.md` files with YAML frontmatter, supports all frontmatter fields (`name`, `description`, `allowed-tools`, `model`, `effort`, `context: fork`, `hooks`, `paths`, `argument-hint`, `disable-model-invocation`, `user-invocable`, `shell`), and provides both slash-command and description-match invocation.
- **Rules**: Full support. Rules in `.claude/rules/` are loaded as always-on context. Claude Code reads the markdown content directly.
- **Commands**: Full support, though commands are considered legacy. Claude Code supports slash-command invocation for command files in `.claude/commands/`.
- **References**: Supported via skill `references/` directories. When a skill body links to a reference file, Claude Code follows the link and reads the content.
- **Docs**: Manual read only. Claude Code can read doc files when instructed but does not auto-load them.
- **Agents**: Full support. Claude Code can spawn sub-agents with their own persona, tools, and forked context.

## Cursor

Cursor has full support for skills and rules but partial or adapted support for other types:

- **Skills**: Full support. Cursor reads `SKILL.md` files and supports the core frontmatter fields. Slash-command and description-match invocation both work.
- **Rules**: Full support via `.mdc` format. Cursor's native rule format uses `.mdc` files with `alwaysApply`, `globs`, and `description` in frontmatter. Clankgster sync transforms `.md` rules into `.mdc` format for Cursor. The `globs` field enables file-pattern-based conditional rules, which is Cursor's primary conditional mechanism.
- **Commands**: Partial support. Cursor supports slash commands but the command format may differ from Claude Code's expectations. Simple commands work; complex ones may need adaptation.
- **References**: Supported via skill `references/` directories, same as Claude Code.
- **Docs**: Manual read only.
- **Agents**: Partial support. Cursor has its own agent/persona mechanisms that may not fully align with the `agents/` format used by Claude Code.

## Codex

Codex has the most limited support, relying on `AGENTS.md` as its primary context mechanism:

- **Skills**: Full support. Codex reads `SKILL.md` files and supports the core frontmatter fields.
- **Rules**: Supported via `AGENTS.md`. Codex does not read `.claude/rules/` or `.mdc` files. Instead, rules must be placed in or referenced from `AGENTS.md` files at appropriate directory levels. Clankgster sync can generate `AGENTS.md` content from plugin rules.
- **Commands**: Partial support. Codex supports slash commands but the ecosystem is less mature than Claude Code's.
- **References**: Supported via skill `references/` directories.
- **Docs**: Manual read only.
- **Agents**: Limited support. Codex's sub-agent capabilities are more constrained than Claude Code's. The `agents/` content type may not map cleanly to Codex's execution model.

## Agent Skills standard

The Agent Skills standard defines which content types are part of the portable specification:

| Type      | In spec?        | Notes                                                   |
| --------- | --------------- | ------------------------------------------------------- |
| Skill     | Core spec       | The primary content type defined by the standard        |
| Rule      | Not in spec     | Agent-specific; each agent has its own rules mechanism  |
| Command   | Not in spec     | Legacy; not part of the portable standard               |
| Reference | Optional in spec| Defined as supporting material within skill directories |
| Doc       | Not in spec     | Background content outside the agent context system     |
| Agent     | Not in spec     | Sub-agent mechanisms vary too much across platforms     |

Skills and references are the most portable content types because they are defined (or accommodated) by the Agent Skills standard. Rules are the least portable because each agent platform has its own rules format and loading mechanism.

## Portability assessment

**Highly portable** (works the same across agents):

- Skills (core frontmatter is standardized)
- References (plain markdown, linked by path)
- Docs (plain markdown, read explicitly)

**Partially portable** (works but format or behavior varies):

- Rules (Claude Code uses `.md` in `.claude/rules/`, Cursor uses `.mdc` with different frontmatter, Codex uses `AGENTS.md`)
- Commands (slash-command support varies)
- Agents (sub-agent mechanisms differ significantly)

The portability gap is the primary motivation for Clankgster sync: write content once in an agent-agnostic format, and let sync transform it into each agent's native format. Rules benefit the most from this transformation because the format differences are the largest.

---

*Parent: [Content type comparison matrix](common-content-type-comparison-matrix.md)*
