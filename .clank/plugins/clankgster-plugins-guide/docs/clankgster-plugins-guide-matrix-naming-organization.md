# Naming and organization

Naming conventions, prefix requirements, uniqueness constraints, and how sync namespaces content across agents.

---

## Naming conventions by type

Each content type follows a distinct naming pattern:

**Skills** prefer gerund-based names that describe the action: `processing-pull-request`, `debugging-test-failure`, `generating-changelog`. The gerund form signals that the skill is an active workflow. The skill lives in a subdirectory (`skills/<name>/SKILL.md`), so the folder name carries the identity.

**Rules** use plugin-prefix plus a descriptive name: `clankgster-sync-trust-sync-workflow.md`, `pino-logger-logging.md`. The prefix prevents collisions when multiple plugins contribute rules to the same agent rules directory.

**Commands** follow the same plugin-prefix pattern as rules: `clankgster-sync-run-sync.md`. Commands live in `commands/` and are symlinked into agent command directories.

**References** use plugin-prefix plus a topic name: `clankgster-sync-writing-conventions.md`. References live in `references/` at the plugin root and are linked by path from skills and rules.

**Docs** use plugin-prefix plus a topic name: `clankgster-plugins-guide-deep-research-report.md`. Docs live in `docs/` and are not synced to agent directories.

**Agents** use plugin-prefix plus a role name: `clankgster-sync-reviewer.md`. The name describes the persona or specialization.

## Plugin name prefix

The plugin name prefix is the primary collision-avoidance mechanism. Every content file (except standard names like `README.md`, `SKILL.md`, `plugin.json`) must be prefixed with the plugin name and a hyphen.

Why this matters: when sync symlinks rules from multiple plugins into `.claude/rules/`, two plugins could both have a file named `logging.md`. The prefix makes them unique: `pino-logger-logging.md` vs. `app-logger-logging.md`.

The prefix rule applies to:

- Rule files in `rules/`
- Command files in `commands/`
- Reference files in `references/`
- Doc files in `docs/`
- Agent files in `agents/`
- Skill folders in `skills/` (the folder name is prefixed)

Exempt from prefixing: `README.md`, `plugin.json`, `SKILL.md`, `hooks.json`, and other standard file names that have a fixed meaning regardless of plugin.

## Uniqueness requirements

**Skills, rules, commands, and agents** must have globally unique names across all plugins in the monorepo. This is because they are synced into shared directories where name collisions would overwrite content.

**References** are identified by their full path (`references/plugin-name-topic.md`), so uniqueness is less strict. However, descriptive prefixed names are still recommended for clarity.

**Docs** are not synced, so uniqueness constraints are relaxed. Prefixed names are recommended for consistency but not enforced.

## Sync namespacing

Clankgster sync maps plugin content into agent-specific directories:

| Type      | Sync behavior                          | Target location example           |
| --------- | -------------------------------------- | --------------------------------- |
| Skill     | Registered as `plugin:skill-name`      | Agent skill catalog               |
| Rule      | Symlinked to agent rules directory     | `.claude/rules/<prefix-name>.md`  |
| Command   | Symlinked to agent commands directory  | `.claude/commands/<prefix-name>.md` |
| Reference | Not synced directly                    | Stays in plugin `references/`     |
| Doc       | Not synced                             | Stays in plugin `docs/`           |
| Agent     | Symlinked to agent directory           | `.claude/agents/<prefix-name>.md` |

**Skills** use a `plugin:skill-name` namespace in the agent's skill catalog. This means a skill named `process-pr` in the `code-review` plugin becomes `code-review:process-pr`. The namespace prevents collisions even if two plugins have identically named skills.

**Rules and commands** are symlinked directly into the agent's directory. The plugin-prefix in the file name is the only collision prevention. If two plugins both produce a file with the same prefixed name, sync will warn or fail.

**References and docs** are not synced into agent directories. They remain in the plugin source tree and are accessed via relative paths from skills and rules that link to them.

**Agents** are symlinked similarly to rules. The plugin-prefix ensures uniqueness.

---

*Parent: [Content type comparison matrix](clankgster-plugins-guide-content-type-comparison-matrix.md)*
