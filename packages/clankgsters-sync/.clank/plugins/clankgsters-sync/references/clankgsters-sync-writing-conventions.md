# Writing rules, commands, and skills (clankgsters-sync)

## rules/ purpose

- Plugin `rules/` = agent-agnostic guidance symlinked by sync into each agent’s rules dir (e.g. `.claude/rules/<plugin-name>/`, `.cursor/rules/<plugin-name>/`)
- Intent: patterns, constraints, references used whenever the plugin is active
- One source; symlinks give all agents the same content
- Keep short critical info in CLANK.md; use [plugin README](../README.md) (or package/docs) for expanded guidance

## Format (rules)

Use **`.md`** only in plugin sources; do not use `.mdc` or platform-specific frontmatter in `.clank/plugins/.../rules/`.

- Avoid `.mdc`, `globs`, `alwaysApply` in sources — not agent-agnostic; plain markdown works for every agent after sync (Cursor may materialize `.mdc` from sync; that is the tool’s job, not author hand-edits)

## Guidelines (for AI authors)

- Keep text condensed, succinct, no trailing punctuation; sacrifice grammar for concision
- Keep things DRY — one canonical source per concern; link from README/CLANK.md/other rules/**references** instead of restating
- One concern per file; split large rules
- Reference code or docs; do not paste long snippets
- Bullet fragments over prose; no trailing punctuation on bullets
- Keep files short; agents ignore buried instructions
- **Commands** = step lists; put context in rules or references
- **Skills** = purpose + when to use; no essays

## Writing-specific (commands vs skills vs README)

- No redundant "Relation" sections — CLANK.md or README already link rules; omit unless cross-plugin or non-obvious
- Focus on common path; link to official docs for edge cases

## Examples

- DRY: ❌ rule file pastes full "How to run sync" from README → ✅ rule says "Run sync: see [references](./clankgsters-sync-sync-behavior-and-config.md)" or [plugin README](../README.md)
- Concise: ❌ "You should run pnpm lint before you commit your changes so that the codebase stays consistent." → ✅ "Run pnpm lint before committing"

## File naming

Unique names across plugins: prefix `rules/`, `commands/`, `skills/`, `agents/` files with the plugin name. Full rule: [clankgsters-sync-file-naming.md](../rules/clankgsters-sync-file-naming.md).

Base new plugins on the clankgsters-sync driver layout. **Never hand-mirror into agent dirs** — [clankgsters-sync-trust-sync-and-sources.md](./clankgsters-sync-trust-sync-and-sources.md).
