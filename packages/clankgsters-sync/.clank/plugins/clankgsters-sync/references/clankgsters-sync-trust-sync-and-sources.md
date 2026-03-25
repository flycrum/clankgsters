# Trust sync — no manual agent mirrors

**Purpose:** Agents (human or AI) edit **agent-agnostic sources** only; **never** hand-create symlinks or register rules, commands, skills, or plugins under `.cursor/`, `.claude/`, Codex outputs, or marketplace JSON.

## Source of truth

- **Plugins:** `.clank/plugins/<name>/` (manifests, `rules/`, `commands/`, `skills/`, etc.)
- **Flat skills:** `.clank/skills/<name>/` (and `.local` / shorthand layouts per config)
- **Config:** repo root `clankgsters.config.ts`
- **Sync** materializes agent-specific trees, manifests, and marketplace entries from those inputs

Do **not** manually link or copy content into agent-native dirs to “fix” discovery — extend or fix **`@clankgsters/sync`** instead.

## After any create / edit / delete under `.clank/` or `clankgsters.config.ts`

1. Open **`packages/clankgsters-sync/package.json`** and read the **`clankgsters-sync:run`** (and `:clear` if needed) script — **do not** assume line numbers or script names; they can change
2. Run that command from the **monorepo root** (or the documented equivalent for your layout)
3. **Verify** expected outputs (e.g. `.cursor/rules/`, `.cursor/skills/`, `.claude-plugin/marketplace.json`, `AGENTS.override.md` section, cache paths)

## When reporting results (AI agents)

- If outputs are **wrong or missing** after sync: prefix the user-visible reply with **`🚨🚨🚨`** and say what was expected vs what appeared
- If sync **succeeded** and you confirmed the expected files/links: prefix with **`🛸🛸🛸`**

Human contributors can skip the emoji convention; it is for loud visibility when automation reports sync outcomes.
