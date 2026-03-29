---
name: rawdocs-test-iterative-syncs-loop-round
description: >-
  Executes one iterative-sync round with run-1 baseline, rawdocs-only mutation
  phase, run-2 post-mutation continuity, scoring, and evidence-backed patch
  application.
---

# rawdocs test iterative syncs loop round

## Scope

Use this skill for exactly one round inside the iterative-sync loop. One round is:

1. run baseline continuity pass (`run-1`)
2. apply **rawdocs-only** mutations (taxonomy profile + continuity edit)
3. run post-mutation continuity pass (`run-2`)
4. score against sync goals
5. apply targeted evidence-backed patches
6. return one round report

**Caller must provide:**

1. `TARGET_PLUGIN_PATH` (existing plugin root path)
2. `ROUND_INDEX`

## Pre-checks

**STOP** if `TARGET_PLUGIN_PATH` does not exist.

**STOP** if `TARGET_PLUGIN_PATH/rawdocs/` does not exist.

## Steps

1. **Run 1 baseline.** Follow [`execution-run-1.md`](references/execution-run-1.md), substituting caller `TARGET_PLUGIN_PATH`.
2. **Mutations (rawdocs only).** Follow [`execution-mutation-window.md`](references/execution-mutation-window.md).
3. **Run 2 post-mutation.** Follow [`execution-run-2.md`](references/execution-run-2.md) with the same `TARGET_PLUGIN_PATH`.
4. Produce round report using [`iteration-report-shape.md`](../refine-test-iterative-syncs/references/iteration-report-shape.md).
5. Score outcomes using [`sync-goals-and-bucketing-criteria.md`](../refine-test-iterative-syncs/references/sync-goals-and-bucketing-criteria.md).
6. Apply targeted improvement patches following [`improvement-application-policy.md`](../refine-test-iterative-syncs/references/improvement-application-policy.md).

## Required report shape

Follow [`iteration-report-shape.md`](../refine-test-iterative-syncs/references/iteration-report-shape.md).

## Verification

Apply [`complex-verification.md`](../../references/tests/complex-verification.md) with caller-provided `TARGET_PLUGIN_PATH`.

- [ ] `ROUND_INDEX` included in round report
- [ ] Step ordering followed: run-1 baseline -> rawdocs mutations -> run-2 post-mutation
- [ ] Exactly one taxonomy mutation profile used during mutations; continuity edit applied (or no-op)
- [ ] Both run-1 and run-2 completed
- [ ] No mutation edits outside `TARGET_PLUGIN_PATH/rawdocs/` during the round
- [ ] Scorecard includes pass/partial/fail against sync goals
- [ ] Any applied patch references a concrete failure signature

## Cross-references

- [`references/execution-mutation-window.md`](references/execution-mutation-window.md)
- [`../seed-test-iterative-syncs/SKILL.md`](../seed-test-iterative-syncs/SKILL.md)
- [`../struct-sync/SKILL.md`](../struct-sync/SKILL.md)
- [`../refine-test-iterative-syncs/references/iteration-report-shape.md`](../refine-test-iterative-syncs/references/iteration-report-shape.md)
- [`../refine-test-iterative-syncs/references/sync-goals-and-bucketing-criteria.md`](../refine-test-iterative-syncs/references/sync-goals-and-bucketing-criteria.md)
