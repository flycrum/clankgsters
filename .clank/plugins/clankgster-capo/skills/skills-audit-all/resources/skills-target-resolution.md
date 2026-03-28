# Standalone skill target resolution (aggregators and skills audits)

Use before any `skills-audit-*` workflow that needs a single **standalone skill directory** (the folder that owns that workflow’s `SKILL.md`).

## Canonical roots

A standalone skill directory usually lives under one of:

- `.clank/skills/<name>/`
- `.clank/skills.local/<name>/`
- `.clank-skills/<name>/`
- `.clank-skills.local/<name>/`

Validation: path exists, is a directory, is under one of these roots, and contains `SKILL.md` at the skill root (not in a random subfolder unless your repo intentionally nests that way — prefer the directory whose `SKILL.md` is the workflow entry).

## Why this shape (brief)

Human-in-the-loop patterns for agents recommend **explicit approval when scope is ambiguous or costly**: show what will run, let the human confirm fast, avoid silent mis-targeting.

For audits, **wrong skill directory = wrong report**, so default to **AskUserQuestion** unless the target is already explicitly bound.

## Explicit binding (no disambiguation question)

Skip `AskUserQuestion` **only** when the target is already unambiguous from **this** turn:

1. **User-named path** — The user message includes a concrete path or `@`-style file reference that resolves to a valid standalone skill directory under one of the canonical roots above.
2. **Structured tool/MCP args** — The route or tool payload includes a field such as `skillPath`, `skillDir`, `skill`, or `target` that already points at that directory.

Then: **validate** (exists, directory, under allowed root, `SKILL.md` present at skill root). If validation fails, ask once with corrected options.

## Do not treat as explicit binding

- Editor “focused” file alone
- “Recently viewed” or open-tabs context alone
- A single `Glob` hit without the user or payload naming that skill directory
- Guessing from chat topic keywords

Those may inform **options** inside `AskUserQuestion`, not silent selection.

## Default: AskUserQuestion

If explicit binding does not apply, **always** call `AskUserQuestion` before launching audits. Never start sub-agents on an assumed skill directory.

### Option construction

- Build **2–4** candidate skill directories using `Glob` for `SKILL.md` under each canonical root pattern (e.g. `.clank/skills/*/SKILL.md`) and offer the **parent directory** of each match as an option.
- If the focused file (when known) sits under one of the canonical roots, resolve the skill root (walk up from the file until you find a directory containing `SKILL.md` that remains under an allowed root, or use the immediate skill folder if the open file is `.../<skill>/SKILL.md`). Add an option: **Use skill directory containing focused file: `<path>`**.
- Always include **Other** (free text: full path to the skill directory).
- Prefer candidates from the current workspace; dedupe paths.

### After selection

- Resolve **Other** to a path; re-validate under allowed roots and `SKILL.md` presence.
- State the chosen skill directory in the audit report header before any leaf work.

## Anti-patterns

- Auditing a plugin skill under `.clank/plugins/.../skills/` when this pathway is **standalone** `skills/` only — use `plugins-audit-*` for plugin-colocated skills
- Proceeding with an “obvious” skill without a question when binding was not explicit
- Asking a vague “which skill?” with no directory examples

## Cross-references (plain paths)

- Skill input pattern: `.clank/plugins/clankgster-capo/skills/skills-write-context/docs/skill-asking-for-user-input.md`
