# rawdocs structural sync execution notes

Detailed execution notes for `rawdocs-struct-sync`.

## Required path state

After input normalization, these variables are mandatory:

- `target_plugin_path`
- `target_rawdocs_path`

Both values must be reused exactly in delegated prompts to ensure consistency.

## Delegation prompt requirements

When delegating to analyzer sub-agents, prompt must include:

1. Exact target path variable
2. Explicit exclusion/inclusion boundaries
3. Required output sections
4. Reminder that rawdocs style fidelity is priority

## Output merge strategy

Merge order:

1. Rawdocs meaning and style constraints
2. Traceability / orphan classification (subtractive default for untraceable paths)
3. Existing structure continuity anchors **for traceable paths only**
4. Structural evolution decisions
5. Final write operations

If there is conflict:

- Prefer rawdocs meaning and **coverage** (what rawdocs still asserts) over retaining legacy files.
- Prefer existing structure for continuity **only when** the path remains traceable to current rawdocs.
- Document rationale for any retention of an **orphan** path (explicit exception) or any structural break from an existing traceable pattern.

## Bucketing guard (avoid lazy `docs/` defaults)

When a rawdocs file has no clear predecessor in the existing plugin tree, do **not** treat plugin-root `docs/` as the default sink. Prefer `skills/` for procedural or agent-invoked workflows and `rules/` for conventions unless the material is intentionally standalone background per [`rawdocs-sync-goals.md`](../../../references/rawdocs-sync-goals.md) and the capo decision-tree references linked from [`../SKILL.md`](../SKILL.md).

## Cleanup guard strategy

Before deletion:

1. Build candidate deletion list from `target_plugin_path`.
2. Remove candidates that are `rawdocs/` or descendants.
3. Execute deletion only on filtered list.
4. Re-check `rawdocs/` existence and content count.

## Recommended report sections

1. Resolved target paths
2. Analyzer scope compliance checks
3. Rawdocs synthesis summary
4. Existing plugin continuity summary
5. First-pass plan
6. Refinement pass adjustments
7. Cleanup and rebuild outcomes
8. Validation checklist

