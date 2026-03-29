# CLANK.md target input (shared)

Use this gate **before** any `clankmd-audit-*` workflow touches a `CLANK.md` file.

## Why this shape (brief)

Human-in-the-loop design treats **ambiguous or costly scope** as a place to pause for a human: show what will run, use **clear prompts** (not vague “approve?”), avoid silent wrong-target work. SDK-style agent docs treat **clarifying questions and approvals** as first-class steps before tools run.

Auditing the wrong `CLANK.md` wastes time and erodes trust. This pathway **does not** infer the file from editor focus, open tabs, “recently viewed,” chat attachments, or repository search — those patterns train wrong picks. **Ask the user directly** for the path, then validate.

## Mandatory first step: `AskUserQuestion`

**Always** call `AskUserQuestion` as the **first** substantive step toward choosing a target, before `Glob`, `SemanticSearch`, listing directories, or reading candidate files.

- **Question intent (plain language):** Which **`CLANK.md` file** should this audit run against? Ask for a **single** repo path (relative to workspace root or absolute, per host conventions).
- **Do not** build options from workspace discovery: no `Glob` on `**/CLANK.md`, no “first hit,” no “focused file” shortcut, no ranked suggestions from search.
- **Options in the UI:** If the host requires multiple choice rows, use **only static, non-discovering** labels (format reminders). Every real path must come from the user — typically **Other** / free text with the full path. Example static rows (adapt wording to the tool): “I will paste the full path in Other,” “Path must be a file named `CLANK.md`.” Do **not** paste paths the agent looked up.

## Sub-agent handoff (same target, no second question)

When a **parent** workflow (e.g. `clankmd-audit-full-suite-md`) already ran this gate and the **sub-agent prompt for this leaf audit** explicitly states the **validated** `CLANK.md` path to use, **skip** a second `AskUserQuestion` for that leaf. Still **re-validate** the path (exists, basename `CLANK.md`) before reads.

Do **not** use this shortcut from vague chat context, `@` mentions alone, editor focus, or search — only from an **explicit path string in the delegated prompt** for this run.

## Non-interactive runtimes

If there is **no** interactive user (batch job, headless MCP), **stop** and require an explicit path from the caller contract (e.g. structured arg). **Never** substitute workspace inference. If the caller gives no path, do not audit.

## Validation (after the user answers)

1. Normalize the answer to a concrete file path.
2. **Validate:** path exists, is a file, basename is `CLANK.md`.
3. If validation fails, ask **once** with the same policy (still no discovery-based options): repeat what you need (“one existing `CLANK.md` path”) and use **Other** for the corrected path.

## After validation

- Echo the chosen path in the audit report header before leaf work.

## Flow (summary)

1. **Standalone / user-facing run:** `AskUserQuestion` → user-supplied path (no discovery-built options) → validate → on failure, one retry with the same rules → proceed
2. **Leaf sub-agent with explicit validated path in prompt:** re-validate only → proceed (no second question)

## Anti-patterns

- Skipping `AskUserQuestion` in an interactive session because the user `@`-mentioned a file, “it’s obvious,” or MCP echoed a path without a human-facing question
- Using `Glob` / search / focus / recent files to populate or choose the target
- Auditing without stating which `CLANK.md` was chosen

