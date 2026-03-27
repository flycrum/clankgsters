# Writing CLANK.md effectively

**Purpose:** Conventions for authoring `CLANK.md` source files that sync into `CLAUDE.md`, `AGENTS.md`, and other agent entry files.

## Rule

Keep `CLANK.md` short, high-signal, and global:

- Prefer under ~150 lines
- Include only critical instructions that should load every session
- Keep guidance concise and link to deeper docs instead of inlining details
- Use `[[[clankgster_agent_name]]]` in the title when agent-specific naming is required

When content is too large or too specific for always-on preload, move it to a source pathway `plugins/` plugin or source pathway `skills/` standalone skill.

## When it applies

- Creating a new `CLANK.md`
- Updating existing global context instructions
- Migrating instructions between `CLANK.md` and plugin content

## When it does not apply

- Writing plugin `rules/` files
- Writing standalone `SKILL.md` files
- Research docs that should not be session-preloaded

