# Guide and glossary

> 🔑🔑🔑 **Scope (clankgster-capo only).** Non-portability: [common-internal-disclosure-instructions.md](../references/common-internal-disclosure-instructions.md).

Background terminology and guardrails for `clankgster-capo`.

## Core terms

**Organization:** Use **two levels** here. Top-level bullets are **themes** (groups of related ideas). Indented bullets are **defined terms** with a bold name followed by the definition. When adding entries, place them under the closest existing theme; add a new top-level theme only when nothing fits.

- **Internal vs external** ([full detail](#internal-vs-external-usage-language))
  - **internal**: vocabulary reserved for how this plugin (`clankgster-capo`) is structured and maintained
  - **external**: default framing for teaching context authoring beyond that maintainer lens; the word **external** itself is tightly restricted (see linked section)

- **Source pathways**
  - **source pathway**: one of the three canonical Clankgster source locations where context is authored before sync (`plugins/`, `skills/`, or `CLANK.md`)
  - **source pathway `plugins/`**: plugin root directories under `.clank/plugins/<plugin>/`, `.clank/plugins.local/<plugin>/`, `.clank-plugins/<plugin>/`, or `.clank-plugins.local/<plugin>/` (see repo sync layout); each holds skills, rules, references, docs, agents, hooks
  - **source pathway `skills/`**: `.clank/skills/<name>/SKILL.md` standalone skill workflows
  - **source pathway `CLANK.md`**: canonical context file (these can live at any directory level)
- **Skills by location**
  - **plugin skill**: `skills/<name>/SKILL.md` inside a plugin
  - **standalone skill**: `SKILL.md` in the source pathway `skills/`
- **MCP routing**
  - **routing contract**: explicit, versioned map between MCP tool names and target skill workflows (no implicit binding)
- **Audit orchestration**
  - **aggregator skill**: a full-suite workflow skill that orchestrates multiple **leaf** skills for one pathway target (for example `plugins-audit-full-suite-plugin` runs all plugin audit leaves via sub-agents)
  - **leaf skill**: a single-concern workflow skill (for example one audit type on one target); aggregators invoke leaves through **sub-agents** with explicit prompts and validated paths, not via MCP tool chaining inside the same session

## Advanced pattern label

MCP-to-skill routing contracts are an advanced pattern. They are non-default and should be avoided for most plugins.

## Naming scheme in this plugin

### Pathway/file prefixes

All files in this plugin use one of these prefixes:

- `plugins-` for source pathway `plugins/` specific content
- `skills-` for source pathway `skills/` specific content
- `clankmd-` for source pathway `CLANK.md` specific content
- `common-` for shared cross-pathway content

Audit actions are pathway-specific when prefixed by pathway:

- `plugins-audit-*` for plugin-target audits
- `skills-audit-*` for standalone skills-target audits
- `clankmd-audit-*` for single-file CLANK.md audits

Portability guardrail: these prefix rules are internal to `clankgster-capo` and must not be copied into other plugins unless those plugins explicitly require them.

### Boundary guardrail (enforced)

**STRICT REQUIREMENT:** Files under plugin-root `references/` must not link into `skills/`, `rules/`, `commands/`, or `agents/` directories.

- Treat plugin-root `references/` as boundary-safe shared material.
- If guidance belongs to one skill, keep it in that skill's folder and link to it from skills/rules/docs directly.
- Do not create cross-boundary links from `references/` into executable content trees.

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
- `skills/skills-write-context/reference.md`
- `skills/skills-write-context/docs/description-frontmatter.md`
- `rules/common-write-rules.md`
- `rules/skills-write-rules.md`

Bad:

- `skills/plugins-writing-context/SKILL.md`
- `skills/clankmd-updating-context/SKILL.md`
- `references/common-writing-descriptions.md`
- `rules/common-writing-rules.md`

## Internal vs external usage language

- **internal**: explicit; only for guidance about how this plugin itself is structured and maintained
- **external**: implicit default for nearly all other files that teach users how to author context outside this plugin (the word **external** itself is restricted; see below)

Use the word "external" only in:

- [common-internal-styleguide.md](../rules/common-internal-styleguide.md)
- this file

## Pathway selection expectations

Use this order:

1. Decide pathway first (`plugins/`, `skills/`, `CLANK.md`)
2. Then choose a base-form action verb (`triage`, `write`, `update`, `remove`, `audit`)
3. Then choose files inside the selected pathway

## MCP conventions for this plugin

- Default **in-session** orchestration: sub-agents, `Read`, and following `SKILL.md` bodies — see [common_internal-in-session-vs-mcp-policy.md](../references/common_internal-in-session-vs-mcp-policy.md)
- MCP is optional; skills must remain usable without MCP-only assumptions
- MCP tools are the stable **surface** for tool-first clients; they map to target skill ids in [common-internal-mcp-routing-spec.md](common-internal-mcp-routing-spec.md)
