# clankgster-brand plugin

Local marketplace plugin for **documentation voice** in Clankgster repos: the **solobot** tone (robot observer, Solomon-adjacent, work-safe).

## Purpose

- One source for voice guidance under `.clank/plugins/clankgster-brand/`; sync writes rules into each agent’s layout per `clankgster.config.ts`
- Skill: [`skills/solobot-voice-tone/SKILL.md`](./skills/solobot-voice-tone/SKILL.md) — mirrored into native agent skill dirs as **`clankgster-brand-solobot-voice-tone`** (plugin name + `-` + skill folder name) so it does not collide with flat `.clank/skills/*`
- Dial: [`rules/clankgster-brand-solobot-voice-whimsy-dial.md`](./rules/clankgster-brand-solobot-voice-whimsy-dial.md)

Do **not** add manual symlinks under `.clank/skills` or `.cursor/skills` — run sync; see [clankgster-sync-trust-sync-workflow.md](../../../packages/clankgster-sync/.clank/plugins/clankgster-sync/rules/clankgster-sync-trust-sync-workflow.md) (driver plugin).

## After changing this plugin

From the monorepo root: run the **`clankgster-sync:run`** script from [`packages/clankgster-sync/package.json`](../../../packages/clankgster-sync/package.json) (check the file for the exact script name), then confirm outputs under `.cursor/`, `.claude/`, etc.
