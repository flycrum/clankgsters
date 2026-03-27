# Content type decision tree

Use this decision tree to determine which plugin content type best fits your material. Start at the top and follow the branches.

---

## Primary decision tree

```md
START: You have content to add to a plugin.
│
├─ Is it a convention, constraint, or guideline that agents should follow?
│  │
│  ├─ YES → Does it describe a multi-step workflow to execute?
│  │  │
│  │  ├─ YES → SKILL (the workflow) + RULE (the convention)
│  │  │         Cross-link them. The rule states the convention;
│  │  │         the skill provides the execution workflow.
│  │  │
│  │  └─ NO → RULE
│  │           One concern per file. State purpose, rule, when it applies.
│  │
│  └─ Does it apply to specific file types only?
│     │
│     ├─ YES → RULE with glob patterns (Cursor .mdc: globs field)
│     │         Example: TypeScript conventions → globs: ["**/*.ts"]
│     │
│     └─ NO → RULE with description-based matching
│              Example: Git workflow conventions → agent evaluates relevance
│
├─ Is it a multi-step workflow an agent should execute?
│  │
│  ├─ YES → Does the user invoke it explicitly (slash command)?
│  │  │
│  │  ├─ YES → SKILL with user-invocable: true (default)
│  │  │         Example: /write-plugin-content, /commit-staged-files
│  │  │
│  │  └─ NO → Should the agent auto-trigger it based on context?
│  │     │
│  │     ├─ YES → SKILL with auto-match description
│  │     │         Write a specific description with trigger phrases.
│  │     │
│  │     └─ NO → SKILL with disable-model-invocation: true
│  │              User must invoke via /skill-name. Description not loaded at startup.
│  │
│  └─ Is the workflow simple (under 30 lines, no branching)?
│     │
│     ├─ YES → COMMAND (legacy format, still supported)
│     │         Single markdown file, no supporting directory.
│     │         Consider: skills are preferred for new content.
│     │
│     └─ NO → SKILL (with references/ for detailed sections)
│
├─ Is it detailed reference material used by multiple skills or rules?
│  │
│  ├─ YES → REFERENCE (in plugin references/ directory)
│  │         Linked from skills and rules via relative paths.
│  │         Not auto-loaded; agent reads on demand.
│  │
│  └─ Is it used by only one skill?
│     │
│     ├─ YES → REFERENCE in skill's own references/ subdirectory
│     │         Keeps related content co-located.
│     │
│     └─ Consider whether it should be inlined in the skill body instead.
│
├─ Is it background knowledge not directly linked from active content?
│  │
│  ├─ YES → DOC (in plugin docs/ directory)
│  │         Never auto-loaded. Useful for research reports,
│  │         comparison matrices, historical context.
│  │
│  └─ Would it be useful if the agent could find it via description matching?
│     │
│     ├─ YES → Consider promoting to REFERENCE and linking from a skill/rule.
│     │
│     └─ NO → DOC is correct. The agent reads it only when told to.
│
├─ Is it a specialized persona or system prompt for a sub-agent?
│  │
│  ├─ YES → AGENT definition (in plugin agents/ directory)
│  │         Markdown file with frontmatter: model, effort, maxTurns,
│  │         allowed-tools, preloaded-skills.
│  │
│  └─ NO → Continue below.
│
├─ Is it an event-driven automation (not AI-driven)?
│  │
│  ├─ YES → HOOK (in plugin hooks/ directory)
│  │         hooks.json defines event → command mappings.
│  │         Deterministic code, not AI instructions.
│  │
│  └─ NO → Continue below.
│
└─ Is it a tool or service connection?
   │
   ├─ YES → MCP server configuration (.mcp.json)
   │         or LSP server configuration (.lsp.json)
   │
   └─ Does not fit any category?
            Re-evaluate: most content fits as a rule (convention)
            or skill (workflow). Consider splitting the content.
```

---

## Edge cases

### Content that is both a convention AND a workflow

**Example:** "All commit messages must follow conventional commits format" (convention) + "Here's how to generate a commit message from a diff" (workflow).

**Solution:** Create both:

- `rules/plugin-name-commit-conventions.md` — states the convention
- `skills/plugin-name-generate-commit/SKILL.md` — executes the workflow, references the rule

### Content that is reference material AND a rule

**Example:** A comprehensive style guide that includes both reference tables and active constraints.

**Solution:** Split into:

- `rules/plugin-name-style-constraints.md` — the active constraints agents must follow (brief)
- `references/plugin-name-style-guide.md` — the full reference tables (detailed)
- The rule links to the reference for detail

### Content too large for a single file

**Example:** A comprehensive prompt engineering guide exceeding 500 lines.

**Solution:**

- Split into multiple focused reference files (one topic per file)
- Create an index reference or README that links to all parts
- Keep each file under the 500-line guideline

### Temporary or experimental content

**Example:** A spike investigation, experimental workflow, or draft convention.

**Solution:** Use `docs/` — it is not auto-loaded, so experimental content does not affect agent behavior. Promote to a rule or skill once validated.

---

## Quick reference table

| Content type | Primary signal | File location | Auto-loaded? |
| --- | --- | --- | --- |
| Skill | Multi-step workflow | `skills/<name>/SKILL.md` | Description at startup; body on invoke |
| Rule | Convention/constraint | `rules/<name>.md` | Always or contextually |
| Command | Simple workflow (<30 lines) | `commands/<name>.md` | On user invoke |
| Reference | Shared detail | `references/<name>.md` | On demand (linked) |
| Doc | Background knowledge | `docs/<name>.md` | Never (explicit read) |
| Agent | Sub-agent persona | `agents/<name>.md` | When sub-agent spawned |
| Hook | Event automation | `hooks/hooks.json` | Event-driven (not AI) |
| Script | Executable code for hooks/skills | `scripts/<name>` | When hook fires or skill invokes |
| MCP | Tool connection | `.mcp.json` | On tool use |
| LSP | Code intelligence | `.lsp.json` | On language features |
