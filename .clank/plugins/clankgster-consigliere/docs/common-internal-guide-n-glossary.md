# Guide and glossary

Background terminology and guardrails for `clankgster-consigliere`.

## Core terms

- **source pathway**: one of the three canonical Clankgster source locations where context is authored before sync (`plugins/`, `skills/`, or `CLANK.md`)
- **source pathway `plugins/`**: `.clank/plugins/<plugin>/` collections (skills, rules, references, docs, agents, hooks)
- **source pathway `skills/`**: `.clank/skills/<name>/SKILL.md` standalone skill workflows
- **source pathway `CLANK.md`**: canonical context file (these can live at any directory level)
- **plugin skill**: `skills/<name>/SKILL.md` inside a plugin
- **standalone skill**: `SKILL.md` in the source pathway `skills/`

## Naming scheme in this plugin

All files in this plugin use one of these prefixes:

- `plugins-` for source pathway `plugins/` specific content
- `skills-` for source pathway `skills/` specific content
- `clankmd-` for source pathway `CLANK.md` specific content
- `common-` for shared cross-pathway content

## Internal vs external usage language

- **internal**: used explicitly and only for guidance about how this plugin itself is structured and maintained
- **external**: used implicitly and it's default for nearly all other files that teach users how to author other context content

Use the word "external" only in:

- [common-internal-styleguide.md](../rules/common-internal-styleguide.md)
- this file

## Pathway selection expectations

Use this order:

1. Decide pathway first (`plugins/`, `skills/`, `CLANK.md`)
2. Then choose action (`triaging`, `writing`, `updating`, `removing`, `auditing`)
3. Then choose files inside the selected pathway

## MCP conventions for this plugin

- MCP is optional and should be used when predictable, structured, chainable actions are useful
- Skills should remain usable without MCP-only assumptions
- If an MCP tool exists for a pathway/action, triaging routes to it after pathway selection

