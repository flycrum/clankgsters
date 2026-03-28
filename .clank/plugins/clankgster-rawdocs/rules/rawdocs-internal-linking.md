# rawdocs internal linking boundary

**Purpose:** Enforce a strict ingestion boundary where `rawdocs/` is input-only and never a markdown link target from authored plugin context.

## Rule

Treat `rawdocs/` as a sealed input zone.

- Never create markdown links from `rules/`, `skills/`, `references/`, `docs/`, `commands/`, `agents/`, or `hooks/` to any file under `rawdocs/`.
- Never require users to navigate `rawdocs/` through published plugin guidance.
- Never treat `rawdocs/` as canonical reference output; canonical output lives in authored plugin folders outside `rawdocs/`.
- Keep `rawdocs/` physically intact during structural sync (do not rewrite, delete, or normalize `rawdocs/` files as part of output generation).

## Design rationale

- `rawdocs/` is intentionally unstructured and draft-friendly.
- Public linking to `rawdocs/` weakens boundary clarity, creates stale references, and blurs source-vs-output ownership.
- A hard no-link rule ensures output quality remains anchored in structured plugin folders.

## Allowed exception shape

You may mention `rawdocs/` conceptually (for policy explanation) without linking to specific files inside it.

## When it applies

- Any skill, rule, or doc generation run inside `clankgster-rawdocs`
- Any structural sync or refactor step where paths are planned or links are validated
- Any lint/audit check for plugin link hygiene

## When it does not apply

- Reading `rawdocs/` contents for analysis in isolated ingestion steps
- Internal path handling for file IO during structural sync execution, where no markdown links are emitted
