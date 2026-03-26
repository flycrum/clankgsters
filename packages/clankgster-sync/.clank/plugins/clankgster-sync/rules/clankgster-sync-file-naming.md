# Plugin file naming (unique across projects)

**Purpose:** Names in rules/, commands/, skills/, agents/ can collide across plugins. Prefix with plugin name so files are unique.

**Rule:** In plugin content folders — rules/, commands/, skills/, agents/ — prefix each file name with the plugin name and a hyphen. Examples: `clankgster-sync-rules-purpose-and-guidelines.md`, `pino-logger-logging.md` (in pino-logger plugin). Skill folders: e.g. `skills/clankgster-sync-add-new-plugin/SKILL.md`. Apply beyond this repo when plugins may be mixed or discovered together.

**Exempt:** README.md, plugin.json, SKILL.md, hooks.json — standard names stay as-is. Subfolders (e.g. skills/debug-foo/SKILL.md) use the folder for scope; prefix the folder or the file per convention. Optional **`references/`** at plugin root holds shared markdown; use descriptive names (this plugin uses a `clankgster-sync-` prefix for top-level reference files).

**Good:** `clankgster-sync-rules-purpose-and-guidelines.md`, `pino-logger-logging.md`, `pino-logger-tail-log.md` — plugin name + hyphen + descriptive name; no collision if multiple plugins have a "logging" or "tail-log" rule

**Bad:** `add-new-plugin.md`, `logging.md`, `tail-log.md` — same name in two plugins (e.g. clankgster-sync and pino-logger both with `logging.md`) causes ambiguity when rules are symlinked or mixed
