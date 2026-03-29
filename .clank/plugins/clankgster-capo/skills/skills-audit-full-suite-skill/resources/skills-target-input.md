# Standalone skill target input (aggregators and skills audits)

Use this gate **before** any `skills-audit-*` workflow that needs a single **standalone skill directory** (the folder that owns that workflow’s `SKILL.md`).

## Allowed roots (validation only)

After the user names a path, it must be a directory under one of:

- `.clank/skills/<name>/`
- `.clank/skills.local/<name>/`
- `.clank-skills/<name>/`
- `.clank-skills.local/<name>/`

Validation: path exists, is a directory, is under one of these roots, and contains `SKILL.md` at the skill root (the directory whose `SKILL.md` is the workflow entry).

## Why this shape (brief)

Human-in-the-loop patterns recommend **explicit human control** when the wrong folder would produce the wrong report. Agent tooling docs treat **clarifying questions** as the right tool when scope is not fixed.

Do **not** infer the skill directory from editor focus, open tabs, attachments, or repository search.

## Mandatory first step: `AskUserQuestion`

**Always** call `AskUserQuestion` as the **first** substantive step toward choosing a target, before `Glob`, `SemanticSearch`, or scanning skill trees.

- **Question intent (plain language):** Which **standalone skill folder** should this audit use — under `.clank/skills/<name>/`, `.clank/skills.local/<name>/`, `.clank-skills/<name>/`, or `.clank-skills.local/<name>/`? Ask for the **directory path** that contains that skill’s `SKILL.md` (the workflow root), not a nested file path alone.
- **Do not** build options from workspace discovery: no `Glob` for `**/SKILL.md`, no “skill containing focused file,” no deduped candidate lists.
- **Options in the UI:** If the host requires multiple choice rows, use **only static, non-discovering** labels (e.g. “I will paste the full skill directory path in Other,” “Path must be the folder that contains `SKILL.md`, not a file inside it”). The real path must come from the user — typically **Other** / free text.

## Sub-agent handoff (same target, no second question)

When a **parent** workflow (e.g. `skills-audit-full-suite-skill`) already ran this gate and the **sub-agent prompt for this leaf audit** explicitly states the **validated** standalone skill directory to use, **skip** a second `AskUserQuestion` for that leaf. Still **re-validate** the path before reads.

Do **not** use this shortcut from vague chat context, `@` mentions alone, editor focus, or search — only from an **explicit path string in the delegated prompt** for this run.

## Non-interactive runtimes

If there is **no** interactive user, **stop** and require an explicit skill directory path from the caller. **Never** substitute search or editor inference.

## Validation (after the user answers)

1. Normalize the answer to a concrete directory path.
2. **Validate** against **Allowed roots** and `SKILL.md` presence as above.
3. If validation fails, ask **once** with the same policy (still no discovery-based options).

## After validation

- State the chosen skill directory in the audit report header before leaf work.

## Flow (summary)

1. **Standalone / user-facing run:** `AskUserQuestion` → user-supplied skill directory (no discovery-built options) → validate → on failure, one retry with the same rules → proceed
2. **Leaf sub-agent with explicit validated path in prompt:** re-validate only → proceed (no second question)

## Anti-patterns

- Auditing a plugin-colocated skill under `.clank/plugins/.../skills/` with this pathway — use `plugins-audit-*` instead
- Skipping `AskUserQuestion` because a path was mentioned informally in chat without this gate
- Using `Glob` or search to populate `AskUserQuestion` options

