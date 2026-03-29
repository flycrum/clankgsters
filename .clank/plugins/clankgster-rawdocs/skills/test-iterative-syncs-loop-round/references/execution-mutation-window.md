# Rawdocs mutations (between run 1 and run 2)

**Purpose:** Single reference for mutation work during one `rawdocs-test-iterative-syncs-loop-round`.
During this mutation step, mutate **only** `TARGET_PLUGIN_PATH/rawdocs/`; non-`rawdocs/` output must come from [`rawdocs-struct-sync`](../struct-sync/SKILL.md), not direct edits.

## Hard boundary (refine / iterative continuity)

**Only** paths under `TARGET_PLUGIN_PATH/rawdocs/` may be edited to simulate upstream documentation change.

- **Do not** edit `rules/`, `skills/`, `references/`, `docs/`, `commands/`, `agents/`, `hooks/`, manifests, or `README.md` under `TARGET_PLUGIN_PATH` for mutation, scenario setup, or “continuity simulation.” Those areas are **outputs** of [`rawdocs-struct-sync`](../../struct-sync/SKILL.md); changing them directly bypasses the workflow under test and invalidates round evidence.
- **Exception:** The **seed** phase (before the loop) may create or reset scaffold files outside `rawdocs/` per [`rawdocs-seed-test-iterative-syncs`](../../seed-test-iterative-syncs/SKILL.md). **Inside** each loop round, treat non-`rawdocs/` tree changes as **struct-sync only**.

This matches the plugin intent: `rawdocs/` is source truth; structural sync reorganizes it into plugin-worthy context.

Run this phase after run 1 completes and before run 2 starts.

## Step 1: Taxonomy mutation profile

1. Generate one mutation profile using [`mutation-generation-strategy.md`](../../refine-test-iterative-syncs/references/mutation-generation-strategy.md) and [`mutation-taxonomy.md`](../../refine-test-iterative-syncs/references/mutation-taxonomy.md).
2. Apply **only** that profile’s edits under `TARGET_PLUGIN_PATH/rawdocs/` (additions, removals, renames, or `no-op`). Do not touch files outside `rawdocs/`.

## Step 2: Continuity mutation

Apply the fixed continuity edit from [`complex-mutation.md`](../../../references/tests/complex-mutation.md) (same `TARGET_PLUGIN_PATH`).

If the target heading is already absent from `rawdocs/testing-types.readme.md`, treat this continuity step as a **no-op** and proceed to run 2.
