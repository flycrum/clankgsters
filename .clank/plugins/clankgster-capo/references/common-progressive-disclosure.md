# Progressive disclosure in agent context

How AI coding agents load content at different stages, and how to design files that work with this layered loading model.

---

## Table of contents

1. [The loading model](#the-loading-model)
2. [Layer details](#layer-details)
3. [Design implications](#design-implications)
4. [Content type loading behavior](#content-type-loading-behavior)
5. [Designing for each layer](#designing-for-each-layer)
6. [Common mistakes](#common-mistakes)

---

## The loading model

Agent context is loaded in layers, from cheapest to most expensive:

```md
┌─────────────────────────────────────────────────┐
│ Layer 0: Always loaded                          │
│ - System prompt                                 │
│ - CLAUDE.md / AGENTS.md / .cursorrules          │
│ - Skill names + descriptions (~100 tokens each) │
│ - Always-on rules                               │
├─────────────────────────────────────────────────┤
│ Layer 1: Contextually loaded                    │
│ - Rules matching file globs or descriptions     │
│ - Cursor .mdc rules with matching globs         │
├─────────────────────────────────────────────────┤
│ Layer 2: On invocation                          │
│ - Full SKILL.md body (on user or auto-invoke)   │
│ - Command file body                             │
├─────────────────────────────────────────────────┤
│ Layer 3: On demand                              │
│ - references/ files (when agent follows a link) │
│ - scripts/ output (when agent runs a script)    │
│ - assets/ content (when agent reads a template) │
├─────────────────────────────────────────────────┤
│ Layer 4: Explicit read                          │
│ - docs/ files (only when agent is told to read) │
│ - External URLs (WebFetch)                      │
│ - Other repo files (Read tool)                  │
└─────────────────────────────────────────────────┘
```

Each layer is more expensive: it consumes more context window budget and takes more time to process. Design content to live at the **cheapest layer that serves its purpose**.

---

## Layer details

### Layer 0: Always loaded (startup)

- **What:** Skill descriptions, always-on rules, root context files (CLAUDE.md, AGENTS.md, .cursorrules).
- **Budget:** Descriptions share a pool of **2% of context window** (fallback: 16,000 characters). With Claude's 200k context, that is approximately 4,000 characters for ALL skill descriptions combined.
- **Implication:** Every description competes with every other description. Keep them concise, specific, and front-loaded with distinctive terms.

### Layer 1: Contextually loaded

- **What:** Rules that activate based on file patterns (Cursor `.mdc` with `globs`) or relevance matching (Cursor `.mdc` with `description`, Claude rules based on the agent's assessment).
- **Budget:** Variable; depends on how many rules match the current context. A rule that matches every file pattern is effectively always-on.
- **Implication:** Use file-pattern rules for conventions that apply to specific file types. Use description-based rules for broader guidance that the agent should consider when relevant.

### Layer 2: On invocation

- **What:** Full SKILL.md body when a skill is invoked (by user slash command or auto-match). Full command file body when a command is triggered.
- **Budget:** Recommended under 5,000 tokens for SKILL.md body. This is a soft limit — longer files work but consume more context window.
- **Implication:** The SKILL.md body is the "orchestrator" — it tells the agent what to do. Detailed reference material belongs in Layer 3 files.

### Layer 3: On demand

- **What:** `references/` files when the agent follows a link from the SKILL.md body. `scripts/` output when the agent runs a preprocessing command. `assets/` when the agent reads a template.
- **Budget:** Variable per file. Keep individual reference files focused. Use a table of contents for files over 100 lines.
- **Implication:** References load only when the agent decides to follow the link. Write SKILL.md links as clear recommendations, not optional footnotes.

### Layer 4: Explicit read

- **What:** `docs/` files, external URLs, arbitrary repo files. These never load automatically — the agent only reads them when explicitly instructed.
- **Budget:** Zero impact until explicitly loaded.
- **Implication:** Put background research, deep dives, and archival information in docs/. The agent will not read these unless the skill or rule tells it to, or the user asks.

---

## Design implications

### Front-load the "what" and "when"

The description (Layer 0) answers: "What does this skill do, and when should it be used?" The body (Layer 2) answers: "How does the agent execute it?" The references (Layer 3) answer: "What are the detailed techniques and guidelines?"

### Do not duplicate across layers

If the description says "transforms content into plugin files," the body does not need to re-explain this. The body should start with scope/constraints, then dive into steps.

### Link, do not inline

When the SKILL.md body needs detailed guidance (prompt techniques, tool catalogs, naming conventions), link to a reference file rather than inlining the content. The agent loads the reference only when it needs it, preserving context window budget for the conversation.

### Design docs/ as opt-in

Files in `docs/` never auto-load. They are useful for:

- Deep research reports the user wants to read manually
- Background context an agent can be told to read for a specific task
- Comparison matrices and decision trees that inform human decisions

---

## Content type loading behavior

| Content type | Layer | Auto-loaded? | When loaded |
| --- | --- | --- | --- |
| Skill description | 0 | Yes | Every session |
| Always-on rule | 0 | Yes | Every session |
| Glob-matched rule | 1 | Conditional | When file pattern matches |
| Description-matched rule | 1 | Conditional | When agent assesses relevance |
| SKILL.md body | 2 | On invoke | User or auto-match invocation |
| Command body | 2 | On invoke | User invocation |
| Reference file | 3 | On demand | Agent follows link from active content |
| Script output | 3 | On demand | Agent runs preprocessing command |
| Asset file | 3 | On demand | Agent reads template |
| Doc file | 4 | No | Only when explicitly instructed |

---

## Designing for each layer

### For Layer 0 (descriptions)

- Third person, action-oriented
- Under 1,024 characters
- Include trigger phrases
- Front-load distinctive terms
- See the skill-owned description-frontmatter guidance in `skills-write-context/docs/description-frontmatter.md`

### For Layer 1 (contextual rules)

- One concern per rule file
- Under 200 lines preferred, 500 max
- Clear scope statement at top
- Use markdown heading hierarchy for scannability

### For Layer 2 (skill/command bodies)

- Under 500 lines / 5,000 tokens
- Start with scope, not background
- Use numbered steps for sequential workflows
- Include verification checklist at end
- Link to references for detailed techniques

### For Layer 3 (references)

- One topic per file
- Table of contents for files over 100 lines
- Can be longer than skills/rules (the agent loads these only when needed)
- Use descriptive file names (the agent uses the name to decide whether to follow the link)

### For Layer 4 (docs)

- No length restriction (not auto-loaded)
- Use for research dumps, comparison matrices, archival content
- Always tell the agent explicitly when to read a doc file

---

## Common mistakes

### Putting everything in Layer 0

Loading detailed instructions as always-on rules or in the description burns budget for every session, even when the skill is not invoked.

**Fix:** Move detailed instructions to the SKILL.md body (Layer 2) or references (Layer 3). Keep Layer 0 lean.

### Inlining reference content in SKILL.md

Copying prompt technique guidelines into the SKILL.md body instead of linking to the reference file. This bloats the SKILL.md and makes updates harder.

**Fix:** Link to the reference with a brief summary of what it covers. "For prompt technique guidelines, see [common-prompt-techniques.md](../../references/common-prompt-techniques.md)."

### No table of contents on long references

Reference files over 100 lines without a TOC force the agent to read the entire file to find the relevant section.

**Fix:** Add a TOC at the top with anchor links. The agent can jump to the relevant section.
