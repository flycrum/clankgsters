---
name: rawdocs-refine-test-iterative-syncs
description: >-
  Refine the struct-sync system through targetted iterative sync refinement loops. This is a thing orchestrators that
  seeds the dedicated fixture, runs strict full-budget loop rounds, and returns a consolidated evidence-led
  report for the next refinement cycle.
---

# rawdocs refine test iterative syncs

## Scope

Run the iterative-sync refinement workflow through three phases:

1. seed fixture
2. execute strict loop
3. return final report

## Fixed target path

Use this exact fixture path:

`.clank/plugins/_rawdocs-refine-test-iterative-syncs`

Treat this as `TARGET_PLUGIN_PATH` for all phases.

## Hard boundaries

- Never modify `TARGET_PLUGIN_PATH/rawdocs/` during sync execution; only mutate rawdocs in explicit mutation steps.
- Never edit the fixture’s non-`rawdocs/` paths (`rules/`, `skills/`, `references/`, etc.) to simulate change—only `rawdocs/` may be mutated for scenarios; [`rawdocs-struct-sync`](../struct-sync/SKILL.md) must produce structured output.
- Never emit markdown links into `rawdocs/`.
- Keep mutation realism aligned with the seed set in [`step-4-seed-rawdocs.md`](../seed-test-iterative-syncs/references/step-4-seed-rawdocs.md).
- Prefer changing `struct-sync` behavior over changing test harness behavior.
- Never create or run ephemeral scripts (`.py`, `.js`, `.sh`, etc.) to automate loop rounds.

## Controls

1. Resolve `ITERATION_BUDGET`:
   - default is `10`
   - if user specifies another count, use that count
2. Apply strict full-budget policy:
   - execute all rounds from `1..ITERATION_BUDGET`
   - do not early-stop based on trend

## Execution phases

1. In a sub-agent, run [`seed-test-iterative-syncs`](../seed-test-iterative-syncs/SKILL.md) and wait for completion.
2. Run [`test-iterative-syncs-loop`](../test-iterative-syncs-loop/SKILL.md) with:
   - same `TARGET_PLUGIN_PATH`
   - resolved `ITERATION_BUDGET`
3. Collect loop output and produce final report.

## Improvement application policy

Follow [`improvement-application-policy.md`](../test-iterative-syncs-loop-round/references/improvement-application-policy.md).

Do not apply speculative refactors; each patch must cite a failure signature from current round evidence.

## Success criteria

Follow [`docs/test-plan.md`](docs/test-plan.md) and [`sync-goals-and-bucketing-criteria.md`](../test-iterative-syncs-loop-round/references/sync-goals-and-bucketing-criteria.md).

Key target: improve continuity and subtractive honesty while funneling synced output to the right plugin buckets with minimal unsupported `docs/` placement.

## Required final output

Return:

1. Controls used (`ITERATION_BUDGET`, strict full-budget mode)
1. Mutation profile log across all rounds
1. Per-round reports
1. Patch ledger of sync/test changes applied
1. Trend summary (churn, bucket placement, goal pass rate)
1. Final recommendation set for next refinement cycle

## Verification

- [ ] Fixture path reset and created once before loop
- [ ] Seed skill completed before loop started
- [ ] Loop skill executed exactly `ITERATION_BUDGET` rounds
- [ ] Each round used a mutation profile from taxonomy
- [ ] Each round produced report-shape-compliant output
- [ ] Most applied patches target struct-sync system files
- [ ] Any test-harness patch is explicitly justified as instrumentation/reporting need
- [ ] No script-based automation was used for round execution

