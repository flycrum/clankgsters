# Test plan — refine test iterative syncs

This plan defines how to run and evaluate iterative structural sync refinement.

## Objective

Improve `rawdocs-struct-sync` outcomes over repeated continuity cycles by:

- varying realistic rawdocs changes
- measuring continuity and bucketing quality
- applying targeted sync-system improvements between iterations

## Why this refactor exists

The previous monolithic refinement skill bundled too many concerns in one place:

- control gathering
- fixture creation lifecycle
- loop orchestration
- per-round execution details
- reporting and patch-policy concerns

That design made behavior less predictable, increased prompt ambiguity, and made it easier for agents to improvise implementation shortcuts.

## Problem statement

Observed failure modes from the monolithic design:

- inconsistent interpretation of "iteration" semantics
- higher risk of ad hoc automation behavior instead of explicit round execution
- noisy control logic (for example pause-mode handling) that distracted from sync goals
- harder troubleshooting because responsibilities were mixed

## Solution approach

The workflow is now split into single-purpose skills:

1. `rawdocs-refine-test-iterative-syncs` (thin orchestrator)
2. `rawdocs-seed-test-iterative-syncs` (fixture reset/seed)
3. `rawdocs-test-iterative-syncs-loop` (strict full-budget sequencing)
4. `rawdocs-test-iterative-syncs-loop-round` (one complete round contract)

This separation improves reliability by making each phase explicit, testable, and easier to verify against sync-goal scorecards.

## Fixture and setup

- Fixed fixture path:
  - `.clank/plugins/_rawdocs-refine-test-iterative-syncs`
- Seed source reference:
  - [`step-4-seed-rawdocs.md`](../../seed-test-iterative-syncs/references/step-4-seed-rawdocs.md)
- Fixture reset happens once before loop start.

## Loop contract

- Default max iterations: `10`.
- User may override count.
- Strict full-budget mode always executes all requested rounds.
- For each iteration:
  1. run continuity baseline (run-1)
  1. generate mutation profile
  1. apply mutation window under `rawdocs/` (two taxonomy-driven passes per `execution-mutation-window.md`)
  1. run post-mutation continuity pass (run-2)
  1. score outputs
  1. patch sync system

## Success measurements

Primary:

1. improved score trend against [`sync-goals-and-bucketing-criteria.md`](../../test-iterative-syncs-loop-round/references/sync-goals-and-bucketing-criteria.md)
2. reduced unnecessary churn for traceable paths
3. stronger subtractive sync behavior when rawdocs removes support

Secondary:

1. better bucket fit (`rules/` and `skills/` first, justified `references/`, minimized top-level `docs/`)
2. fewer policy violations per iteration
3. fewer ad hoc manual corrections required

## Allowed patch targets

Patch priority order:

1. [`../../struct-sync/SKILL.md`](../../struct-sync/SKILL.md)
2. [`../../struct-sync/references/`](../../struct-sync/references/)
3. [`../../../references/rawdocs-structify-architecture.md`](../../../references/rawdocs-structify-architecture.md)
4. [`../../test-iterative-syncs-loop-round/SKILL.md`](../../test-iterative-syncs-loop-round/SKILL.md) only when instrumentation/reporting needs improvement

Apply this using [`improvement-application-policy.md`](../../test-iterative-syncs-loop-round/references/improvement-application-policy.md).

## Reporting

Use [`iteration-report-shape.md`](../../test-iterative-syncs-loop-round/references/iteration-report-shape.md) per iteration and provide a cumulative final trend summary.
