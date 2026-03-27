# Guide and glossary

Background terminology and guardrails for `clankgster-consigliere`.

## Core terms

- **source pathway**: one of the three canonical Clankgster source locations where context is authored before sync (`plugins/`, `skills/`, or `CLANK.md`)
- **source pathway `plugins/`**: `.clank/plugins/<plugin>/` collections (skills, rules, references, docs, agents, hooks)
- **source pathway `skills/`**: `.clank/skills/<name>/SKILL.md` standalone skill workflows
- **source pathway `CLANK.md`**: canonical context file (these can live at any directory level)
- **plugin skill**: `skills/<name>/SKILL.md` inside a plugin
- **standalone skill**: `SKILL.md` in the source pathway `skills/`
- **routing contract**: explicit, versioned map between MCP tool names and target skill workflows (no implicit binding)

## Advanced pattern label

MCP-to-skill routing contracts are an advanced pattern. They are non-default and should be avoided for most plugins.

## Naming scheme in this plugin

### Pathway/file prefixes

All files in this plugin use one of these prefixes:

- `plugins-` for source pathway `plugins/` specific content
- `skills-` for source pathway `skills/` specific content
- `clankmd-` for source pathway `CLANK.md` specific content
- `common-` for shared cross-pathway content

### Standardized action verbs

Action names in this plugin must use base-form verbs:

- `triage`
- `write`
- `update`
- `remove`
- `audit`

Do not use present-participle (`-ing`) forms for action names in files, folders, or route IDs.

### Good and bad naming examples

Good:

- `skills/plugins-write-context/SKILL.md`
- `skills/clankmd-update-context/SKILL.md`
- `references/common-write-descriptions.md`
- `rules/common-write-rules.md`

Bad:

- `skills/plugins-writing-context/SKILL.md`
- `skills/clankmd-updating-context/SKILL.md`
- `references/common-writing-descriptions.md`
- `rules/common-writing-rules.md`

## Internal vs external usage language

- **internal**: used explicitly and only for guidance about how this plugin itself is structured and maintained
- **external**: used implicitly and it's default for nearly all other files that teach users how to author other context content

Use the word "external" only in:

- [common-internal-styleguide.md](../rules/common-internal-styleguide.md)
- this file

## Pathway selection expectations

Use this order:

1. Decide pathway first (`plugins/`, `skills/`, `CLANK.md`)
2. Then choose a base-form action verb (`triage`, `write`, `update`, `remove`, `audit`)
3. Then choose files inside the selected pathway

## MCP conventions for this plugin

- MCP is optional and should be used when predictable, structured, chainable actions are useful
- Skills should remain usable without MCP-only assumptions
- If MCP routing is used, maintain a canonical route table in [common-internal-mcp-routing-spec.md](common-internal-mcp-routing-spec.md)
