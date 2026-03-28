# Plugin target resolution (aggregators and plugin audits)

Use before any `plugins-audit-*` workflow that needs a single plugin root directory.

## Why this shape (brief)

Human-in-the-loop patterns for agents recommend **explicit approval when scope is ambiguous or costly**: show what will run, let the human confirm fast, avoid silent mis-targeting. See general HITL guidance (e.g. when inputs are ambiguous or actions are broad, keep a human confirmation step). Product docs for agent SDKs also treat **user input and approvals** as first-class gates before tool runs.

For audits, **wrong plugin = wrong report**, so default to **AskUserQuestion** unless the target is already explicitly bound.

## Explicit binding (no disambiguation question)

Skip `AskUserQuestion` **only** when the target is already unambiguous from **this** turn:

1. **User-named path** — The user message includes a concrete path or `@`-style file reference that resolves to a directory under `.clank/plugins/<plugin>/` (or names `<plugin>` unambiguously together with `.clank/plugins/`).
2. **Structured tool/MCP args** — The invoking route or tool payload includes a field such as `pluginPath`, `plugin`, or `target` that already points at the plugin root directory.

In those cases: **validate** (path exists, is a directory, lies under `.clank/plugins/`), then proceed. If validation fails, ask once with corrected options.

## Do not treat as explicit binding

- Editor “focused” file alone
- “Recently viewed” or open-tabs context alone
- A single `Glob` hit without the user or payload naming that plugin
- Guessing from chat topic keywords

Those may inform **options** inside `AskUserQuestion`, not silent selection.

## Default: AskUserQuestion

If explicit binding does not apply, **always** call `AskUserQuestion` before launching audits. Never start sub-agents on an assumed plugin.

### Option construction

- Include **2–4** concrete plugin directory paths under `.clank/plugins/*/`, each option showing the full path or clear `<plugin>` name.
- If the focused file (when known) lives under `.clank/plugins/<plugin>/`, add an option such as: **Use plugin containing focused file: `<plugin>`** with the resolved plugin root path.
- Always include **Other** (free text: full path or plugin folder name).
- Prefer listing plugins that appear in workspace; use `Glob` on `.clank/plugins/*/` if needed to build options.

### After selection

- Resolve **Other** to an absolute or repo-root-relative path; re-validate under `.clank/plugins/`.
- State the chosen plugin root in the audit report header before any leaf work.

## Anti-patterns

- Proceeding with “obvious” plugin without a question when binding was not explicit
- Asking a vague “which plugin?” with no path examples
- Auditing `.clank/plugins/` itself unless the user explicitly chose that (normally invalid — prefer a single child plugin)

## Cross-references (plain paths)

- Skill input pattern: `.clank/plugins/clankgster-capo/skills/skills-write-context/docs/skill-asking-for-user-input.md`
