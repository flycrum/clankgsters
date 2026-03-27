---
name: auditing-plugin-structure
description: >-
  Audits plugin directory structure — verifies required files (plugin.json
  manifests, README.md), naming conventions (plugin-name prefix), content type
  placement (conventions in rules, workflows in skills), and SKILL.md
  frontmatter validity. Produces a structure report table with pass/warn/fail
  per check. Triggers — "audit plugin structure", "check plugin layout",
  "validate plugin organization", "is my plugin set up correctly?", structure
  review, plugin scaffold check.
---

# Audit plugin structure

Review plugin organization — correct directories, required files, naming conventions, content type placement.

## Scope

Audits the directory tree and file metadata of a single plugin under `.clank/plugins/<plugin>/`. Report only — does not create or move files.

## Out of scope

- Content quality (use auditing-content-quality)
- Link validity (use auditing-internal-links)
- Runtime behavior or sync output

---

## Pre-checks

**STOP** if no plugin path is provided. Use AskUserQuestion to request it.

**STOP** if the target directory does not exist.

---

## 1. Scan plugin directory

Use Glob to list the full directory tree:

```md
<plugin-path>/**/*
```

Record all files and directories found.

---

## 2. Check required files

<instructions>
Verify the following exist:

1. **Plugin manifests**
   - `.claude-plugin/plugin.json` — must have `name`, `version`, `description`, `author`
   - `.cursor-plugin/plugin.json` — must have `name`, `version`, `description`, `author`, `keywords`
   - Read each manifest with Read and validate JSON fields

2. **README.md** at plugin root — must exist and contain:
   - H1 heading
   - Purpose paragraph
   - Layout section listing subdirectories

3. **Content directories** — at least one of: `rules/`, `skills/`, `references/`, `docs/`, `commands/`

Mark each as: pass / warn (non-critical missing) / fail (required missing)
</instructions>

---

## 3. Check naming conventions

<instructions>
For files in `rules/`, `commands/`, `skills/`, `agents/`:

1. Each file name (except README.md, plugin.json, SKILL.md, hooks.json) must start with the plugin name + hyphen
2. Extract plugin name from manifest or directory name
3. Flag files that lack the prefix

For skill directories:

1. Directory name should be descriptive and kebab-case
2. Must contain a `SKILL.md` file
3. SKILL.md `name` field must match directory name
</instructions>

---

## 4. Validate SKILL.md frontmatter

For each `SKILL.md` found, use Read and check:

- `name` field exists, matches directory name, kebab-case, 1-64 chars
- `description` field exists, 150-700 characters, third person, plain text (no XML/markdown)
- Description includes trigger phrases

---

## 5. Check content type placement

<instructions>
Review each file's content and verify it is in the correct directory:

- **rules/** — should contain conventions, constraints, guidelines (always-on context)
- **skills/** — should contain multi-step workflows triggered by user
- **references/** — should contain detailed reference material linked from rules/skills
- **docs/** — should contain background knowledge, research, matrices
- **commands/** — should contain one-shot executable commands

Flag misplacements:

- A workflow in `rules/` (should be a skill)
- A convention in `skills/` (should be a rule)
- Detailed reference material inlined in a rule (should be in `references/`)
</instructions>

---

## 6. Produce structure report

Output a markdown table:

```markdown
## Structure audit: <plugin-name>

| Check | Status | Details |
|-------|--------|---------|
| .claude-plugin/plugin.json | Pass | All required fields present |
| .cursor-plugin/plugin.json | Fail | Missing `keywords` field |
| README.md | Pass | Has H1, purpose, layout |
| File naming: rules/ | Warn | 2 of 5 files missing plugin prefix |
| SKILL.md: doing-x | Pass | Valid frontmatter, 320 char description |
| Content placement | Warn | rules/workflow-y.md looks like a skill |
| ... | ... | ... |

**Overall:** N pass / N warn / N fail
```

---

## Verification checklist

- [ ] All files and directories in the plugin were scanned
- [ ] Both plugin manifests checked (or absence noted)
- [ ] README.md presence and content verified
- [ ] Every file in content directories checked for naming prefix
- [ ] Every SKILL.md validated for frontmatter fields
- [ ] Content type placement reviewed for at least rules/ and skills/
- [ ] Report includes overall pass/warn/fail counts

---

## Cross-references

- [Organizing plugin content](../../rules/clankgster-context-engineering-organizing-plugin-content.md) — canonical content type placement rules
- [Writing skills](../../rules/clankgster-context-engineering-writing-skills.md) — SKILL.md structure requirements
- [Writing descriptions](../../references/clankgster-context-engineering-writing-descriptions.md) — description field criteria
