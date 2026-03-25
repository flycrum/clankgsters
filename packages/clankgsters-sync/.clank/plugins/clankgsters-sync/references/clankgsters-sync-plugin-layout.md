# Plugin layout and agent-agnostic conventions

## Directory layout (template)

```md
<plugin-name>/
├── .cursor-plugin/plugin.json
├── .claude-plugin/plugin.json
├── skills/
├── agents/
├── commands/
├── hooks/hooks.json
├── rules/ # .md only in sources; see rules/clankgsters-sync-\*.md
├── references/ # optional; shared detail linked from rules/skills/README
├── README.md
└── CLANK.md # optional at plugin root
```

## Agent-agnostic conventions

| Convention         | What we do                                                                                           | Why                                                                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shared content** | One source: `skills/`, `agents/`, `commands/`, `hooks/`, `rules/`, `.mcp.json` at plugin root        | Define once, use everywhere                                                                                                                         |
| **Thin manifests** | `.cursor-plugin/plugin.json` and `.claude-plugin/plugin.json` with minimal metadata                  | Each agent has its own manifest dir                                                                                                                 |
| **Rules**          | Plugin `rules/` → symlinked to `.claude/rules/<plugin>/`; copied as `.mdc` for Cursor where required | See [rules purpose](../rules/clankgsters-sync-rules-purpose-and-guidelines.md) and [writing conventions](./clankgsters-sync-writing-conventions.md) |

**Exceptions:** Cursor path overrides can replace defaults; Claude supplements. Prefer default folders unless you document otherwise.

## scripts/ in a plugin

- **Hook callables** — invoked by `hooks/hooks.json`
- **Plugin-internal tooling** — optional CLIs or helpers; keep separate from sync core in **`@clankgsters/sync`** unless contributing to that package

## skills/ in a plugin

- **`skills/<name>/SKILL.md`** — mirrored into native agent skill dirs by `SkillsDirectorySyncPreset` as **`<plugin-name>-<name>`** (avoids collisions with flat `.clank/skills/<name>`)
- Optional **`references/`**, **`scripts/`**, **`assets/`** per [Agent Skills](https://agentskills.io/specification)
- **Do not** add manual symlinks under `.clank/skills` pointing at plugin skills — run sync; see [trust sync](./clankgsters-sync-trust-sync-and-sources.md)
