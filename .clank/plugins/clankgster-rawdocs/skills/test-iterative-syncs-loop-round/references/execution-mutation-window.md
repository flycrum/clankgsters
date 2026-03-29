# Rawdocs mutations

**Purpose:** Between run 1 and run 2, this phase **simulates how teams use plugin-local `rawdocs/`** in production: authors maintain one or more files there as **source truth for meaning and wording**, and structify sync **then** reorganizes that content into structured plugin output ([README — Intent](../../../README.md#intent)). Mutations model **real drift between syncs** (“write freely first, organize later”), so run 2 is evaluated against **changed** `rawdocs/` instead of a frozen fixture—testing whether another structural sync pass still preserves intent, style, and continuity.

During this mutation step, mutate **only** `TARGET_PLUGIN_PATH/rawdocs/`; non-`rawdocs/` output must come from [`rawdocs-struct-sync`](../../struct-sync/SKILL.md), not direct edits.

## Hard boundary (refine / iterative continuity)

**Only** paths under `TARGET_PLUGIN_PATH/rawdocs/` may be edited, **as authors would**, to simulate draft documentation evolving before the next structural sync.

- **Do not** edit `rules/`, `skills/`, `references/`, `docs/`, `commands/`, `agents/`, `hooks/`, manifests, or `README.md` under `TARGET_PLUGIN_PATH` for mutation, scenario setup, or “continuity simulation.” Those areas are **outputs** of [`rawdocs-struct-sync`](../../struct-sync/SKILL.md); changing them directly bypasses the workflow under test and invalidates round evidence.
- **Exception:** The **seed** phase (before the loop) may create or reset scaffold files outside `rawdocs/` per [`rawdocs-seed-test-iterative-syncs`](../../seed-test-iterative-syncs/SKILL.md). **Inside** each loop round, treat non-`rawdocs/` tree changes as **struct-sync only**.

Run this phase after run 1 completes and before run 2 starts.

## Step 1 - First pass: generate and apply a taxonomy-driven mutation profile

1. Generate one mutation profile using [`mutation-generation-strategy.md`](mutation-generation-strategy.md) and [`mutation-taxonomy.md`](mutation-taxonomy.md).
2. Apply **only** that profile’s edits under `TARGET_PLUGIN_PATH/rawdocs/` (additions, removals, renames, or `no-op`). Do not touch files outside `rawdocs/`.

## Step 2 - Second pass: generate and apply a continuity-biased mutation profile

1. Generate a **second** mutation profile using the same references as Step 1: [`mutation-generation-strategy.md`](mutation-generation-strategy.md) and [`mutation-taxonomy.md`](mutation-taxonomy.md). Drive the strategy inputs (iteration index, prior round outcomes, trend state including **continuity**) so this profile reads as a plausible **follow-on** change after Step 1—e.g. tightening cross-references, partial rollback of a stance, deprecation language, or a small fs-shape tweak that matches the taxonomy—not a duplicate of Step 1’s pattern unless repeatability is intentional per **Step 5** of the strategy document (avoid repetitive patterns).
2. Apply **only** that profile’s edits under `TARGET_PLUGIN_PATH/rawdocs/` (additions, removals, renames, or `no-op`). Do not touch files outside `rawdocs/`. If the second profile is `no-op`, proceed to run 2 with Step 1’s state unchanged by Step 2.
