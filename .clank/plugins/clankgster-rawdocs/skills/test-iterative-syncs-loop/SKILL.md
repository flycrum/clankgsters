---
name: rawdocs-test-iterative-syncs-loop
description: >-
  Executes the iterative-sync loop over a strict round budget by delegating each
  round to rawdocs-test-iterative-syncs-loop-round. Owns loop sequencing and
  aggregate reporting only.
disable-model-invocation: true
user-invocable: false
---

# rawdocs test iterative syncs loop

## Scope

This skill owns loop orchestration only.

- It must run exactly the requested number of rounds (default `10`).
- It must delegate each round to [`rawdocs-test-iterative-syncs-loop-round`](../test-iterative-syncs-loop-round/SKILL.md).
- It must not generate automation scripts to drive the loop.

## Inputs

Caller must provide:

1. `TARGET_PLUGIN_PATH`
2. `ITERATION_BUDGET` (default `10`)

## Hard boundaries

- Do not recreate the fixture path inside this loop.
- Do not skip rounds based on trend. Strict full-budget execution applies.
- Do not create or run ephemeral scripts (`.py`, `.js`, `.sh`, etc.) to execute rounds (aka ephemeral code interpreters).

## Steps

1. Resolve loop budget:
   - If caller specifies `ITERATION_BUDGET`, use it.
   - Otherwise use `10`.
2. For each round index `N` in `1..ITERATION_BUDGET`:
   - invoke [`rawdocs-test-iterative-syncs-loop-round`](../test-iterative-syncs-loop-round/SKILL.md) with:
     - same `TARGET_PLUGIN_PATH`
     - `ROUND_INDEX = N`
   - capture the returned round report
   - append the report to cumulative loop ledger
3. After final round, compute aggregate trend summary:
   - churn trend
   - bucket-fit trend
   - goal pass rate trend
   - patch-impact trend
4. Return:
   - controls used (`ITERATION_BUDGET`)
   - ordered round reports
   - aggregate trend summary
   - next-cycle recommendations

## Verification

- [ ] Loop budget resolved before round 1
- [ ] Exactly `ITERATION_BUDGET` rounds executed
- [ ] Every round delegated to loop-round skill
- [ ] No script-based loop execution used
- [ ] Final output contains per-round reports and aggregate trend summary

