# Plugin target input (aggregators and plugin audits)

Use this gate **before** any `plugins-audit-*` workflow reads plugin markdown or launches sub-agents.

## Allowed roots (validation only)

After the user names a path, the **plugin root** must be a **direct child** directory of one of these plugin containers (same four-way layout as sync-derived paths in `ResolvedSourcePath` / `sync-source-layouts.config.ts`):

- `.clank/plugins/<plugin>/`
- `.clank/plugins.local/<plugin>/`
- `.clank-plugins/<plugin>/`
- `.clank-plugins.local/<plugin>/`

Validation: path exists, is a directory, resolves to a single-plugin root under one of the roots above (not the container alone, e.g. not bare `.clank/plugins/`), and is the folder you intend to audit for this run.

## Why this shape (brief)

Human-in-the-loop patterns recommend **explicit human control** when scope is ambiguous or work is broad: clear prompts, no silent mis-targeting. Agent SDK docs emphasize **user input / approval** before expensive or irreversible tool use.

**Wrong plugin directory = wrong report.** Do not infer it from editor focus, open tabs, chat context, keyword guesses, or directory search.

## Mandatory first step: `AskUserQuestion`

**Always** call `AskUserQuestion` as the **first** substantive step toward choosing a target, before `Glob`, `SemanticSearch`, `list_dir`, or scanning any plugin tree.

- **Question intent (plain language):** Which **plugin root folder** should this audit use? It must live under one of the four layouts in **Allowed roots** (nested vs shorthand, regular vs `.local`). Ask for the **directory path** for that plugin, not a file inside it.
- **Do not** build options from workspace discovery: no `Glob` under those trees for candidates, no “plugin containing focused file,” no candidate list from the tree.
- **Options in the UI:** If the host requires multiple choice rows, use **only static, non-discovering** labels (e.g. “I will paste the full plugin root path in Other,” “Path must be the directory that contains that plugin’s `skills/`, `rules/`, etc.”). The actual path must come from the user — typically **Other** / free text.

## Sub-agent handoff (same target, no second question)

When a **parent** workflow (e.g. `plugins-audit-full-suite-plugin`) already ran this gate and the **sub-agent prompt for this leaf audit** explicitly states the **validated** plugin root directory to use, **skip** a second `AskUserQuestion` for that leaf. Still **re-validate** the path before reads.

Do **not** use this shortcut from vague chat context, `@` mentions alone, editor focus, or tree search — only from an **explicit path string in the delegated prompt** for this run.

## Non-interactive runtimes

If there is **no** interactive user, **stop** and require an explicit plugin root path from the caller (e.g. structured arg). **Never** substitute tree search or editor inference. If no path, do not audit.

## Validation (after the user answers)

1. Normalize the answer to a concrete directory path.
2. **Validate** against **Allowed roots**: exists, directory, direct child of exactly one of `.clank/plugins/`, `.clank/plugins.local/`, `.clank-plugins/`, or `.clank-plugins.local/`.
3. If validation fails, ask **once** with the same policy (still no discovery-based options).

## After validation

- State the chosen plugin root in the audit report header before leaf work.

## Flow (summary)

1. **Standalone / user-facing run:** `AskUserQuestion` → user-supplied plugin root (no discovery-built options) → validate → on failure, one retry with the same rules → proceed
2. **Leaf sub-agent with explicit validated path in prompt:** re-validate only → proceed (no second question)

## Anti-patterns

- Skipping `AskUserQuestion` because the user linked a file under a plugin — still ask for the **root** path in interactive mode
- Populating `AskUserQuestion` options from `Glob` or directory listing
- Starting sub-agents on an “obvious” plugin without the question

