# clankgsters-brand plugin

Local marketplace plugin for **documentation voice** in Clankgsters repos: the **solobot** tone (robot observer, Solomon-adjacent, work-safe).

## Purpose

- One source for voice guidance under `.clank/plugins/clankgsters-brand/`; sync writes rules into each agent’s layout per `clankgsters.config.ts`
- Skill: [`skills/solobot-voice-tone/SKILL.md`](./skills/solobot-voice-tone/SKILL.md) — mirrored into native agent skill dirs as **`clankgsters-brand-solobot-voice-tone`** (plugin name + `-` + skill folder name) so it does not collide with flat `.clank/skills/*`
- Dial: [`rules/clankgsters-brand-solobot-voice-whimsy-dial.md`](./rules/clankgsters-brand-solobot-voice-whimsy-dial.md)

Do **not** add manual symlinks under `.clank/skills` or `.cursor/skills` — run sync; see [clankgsters-sync-trust-sync-workflow.md](../../../packages/clankgsters-sync/.clank/plugins/clankgsters-sync/rules/clankgsters-sync-trust-sync-workflow.md) (driver plugin).

## After changing this plugin

From the monorepo root: run the **`clankgsters-sync:run`** script from [`packages/clankgsters-sync/package.json`](../../../packages/clankgsters-sync/package.json) (check the file for the exact script name), then confirm outputs under `.cursor/`, `.claude/`, etc.
