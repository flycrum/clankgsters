# CLANK.md target resolution (shared)

Use this decision path before running any `clankmd-audit-*` workflow.

## Why this shape (brief)

Human-in-the-loop agent design treats **ambiguous inputs** and **broad or expensive work** as places to keep the human in control: state the intended target, offer fast structured choices, avoid silent wrong-file audits. Agent SDK documentation similarly emphasizes **user input / approval** before proceeding when scope is not fixed.

Auditing the wrong `CLANK.md` wastes time and erodes trust, so **do not silently pick a file** from editor context or search alone.

## Explicit binding (no disambiguation question)

Skip `AskUserQuestion` **only** when the target is already unambiguous from **this** turn:

1. **User-named path** — The user message includes a concrete path or `@`-style reference to a file named `CLANK.md`, or unambiguously identifies one repo path.
2. **Structured tool/MCP args** — The route or tool payload includes a field such as `clankmdPath`, `path`, or `target` pointing at that file.

Then: **validate** (path exists, basename is `CLANK.md`), and proceed. If validation fails, ask once with fixed options.

## Do not treat as explicit binding

- Focused/active editor file alone
- “Recently viewed” list alone
- First hit from `**/CLANK.md` search alone
- Assuming repo root `CLANK.md` without the user or payload naming it

Those may appear as **options** in `AskUserQuestion`, not as automatic selection.

## Default: AskUserQuestion

If explicit binding does not apply, **always** call `AskUserQuestion` before reading or auditing. Do not start work on an assumed file.

### Option construction

- Offer **2–4** candidate paths from `Glob` on `**/CLANK.md` (prefer project-relevant roots).
- If host context includes a **focused file** whose path ends with `CLANK.md`, include an option such as: **Use focused file: `<path>`** (same wording every run so behavior is predictable).
- Always include **Other** for a free-text path.
- Order options so the focused-file option is first when present (fast confirm), not a silent default.

### After selection

- Parse **Other** into a path; validate existence and `CLANK.md` basename.
- Echo the chosen path in the report header before leaf audits.

## Resolution order (summary)

1. Explicit binding? → validate → use
2. Else → `AskUserQuestion` (focused file as first option when applicable + candidates + Other) → validate → use

## Anti-patterns

- “I'll use the open CLANK.md” without a question when binding was not explicit
- Skipping the question when multiple `CLANK.md` files exist
- Auditing without stating which file was chosen

## Cross-references (plain paths)

- Skill input pattern: `.clank/plugins/clankgster-capo/skills/skills-write-context/docs/skill-asking-for-user-input.md`
