# Sync goals and bucketing criteria

Use this as the iteration scorecard for `rawdocs-refine-test-iterative-syncs`.

## Core sync goals

Evaluate against [`rawdocs-sync-goals.md`](../../../references/rawdocs-sync-goals.md).

Priority order:

1. preserve meaning/style from rawdocs
2. subtractive sync for unsupported topics
3. continuity for traceable paths
4. evolve structure when rawdocs growth requires
5. never alter `rawdocs/`

## Bucketing criteria (critical)

### 1) Avoid top-level `docs/` by default

Do not place agent-targeted operational context into plugin-root `docs/` by default.

`docs/` is only appropriate for background/standalone material intentionally opened on purpose.

### 2) `references/` requires link-based justification

A file belongs in `references/` only when at least one authored file links to it for shared depth, reuse, or abstraction.

If no inbound links are expected, reassess placement.

### 3) `rules/` and `skills/` are primary landing zones

Most synced actionable context should begin in:

- `rules/` for conventions
- `skills/` for workflows

Other buckets (`commands/`, `hooks/`, `agents/`) should be uncommon and explicitly justified.

### 4) Align with capo decision policy

Use:

- [`common-content-type-decision-tree.md`](../../../../clankgster-capo/references/common-content-type-decision-tree.md)
- [`common-plugin-docs-folder-linking.md`](../../../../clankgster-capo/references/common-plugin-docs-folder-linking.md)

## Iteration scoring

For each criterion mark:

- `pass`
- `partial`
- `fail`

For `partial`/`fail`, include:

1. observed evidence
2. impact on sync quality
3. specific patch proposal for next iteration
