# Flow — refine test iterative syncs

This document captures purpose, execution plan, handoffs, and reporting flow for the iterative sync refinement system.

## Purpose

The workflow exists to improve `rawdocs-struct-sync` quality through repeatable evidence-led rounds that:

- preserve source meaning
- improve continuity and subtractive behavior
- improve bucket placement quality against policy goals

## Execution contract

1. `rawdocs-refine-test-iterative-syncs` orchestrates and reports.
2. `rawdocs-seed-test-iterative-syncs` owns fixture reset/seed lifecycle.
3. `rawdocs-test-iterative-syncs-loop` owns strict full-budget loop sequencing.
4. `rawdocs-test-iterative-syncs-loop-round` owns one complete round.

`TARGET_PLUGIN_PATH` is fixed to `.clank/plugins/_rawdocs-refine-test-iterative-syncs`.

## Architecture flow

```mermaid
flowchart TD
  refineSkill["rawdocs-refine-test-iterative-syncs"]
  seedSkill["rawdocs-seed-test-iterative-syncs"]
  loopSkill["rawdocs-test-iterative-syncs-loop"]
  roundSkill["rawdocs-test-iterative-syncs-loop-round"]
  structSync["rawdocs-struct-sync"]
  roundLedger["roundReportLedger"]
  finalReport["finalRefinementReport"]

  refineSkill -->|"seed fixture once"| seedSkill
  refineSkill -->|"execute N rounds"| loopSkill
  loopSkill -->|"delegate each round"| roundSkill
  roundSkill -->|"run-1 and run-2 continuity"| structSync
  roundSkill -->|"emit round report"| roundLedger
  loopSkill -->|"aggregate trends"| roundLedger
  roundLedger --> finalReport
  refineSkill -->|"publish final output"| finalReport
```

## Round lifecycle

```mermaid
flowchart TD
  startRound["start round N"]
  runOne["run-1 sync and snapshot"]
  mutationProfile["generate mutation profile"]
  applyMutation["apply mutations to rawdocs"]
  continuityMutation["apply fixed continuity mutation"]
  runTwo["run-2 sync and snapshot"]
  scoreRound["score against sync goals"]
  patchDecision["apply evidence-backed patches"]
  emitRoundReport["emit iteration-report-shape output"]

  startRound --> runOne
  runOne --> mutationProfile
  mutationProfile --> applyMutation
  applyMutation --> continuityMutation
  continuityMutation --> runTwo
  runTwo --> scoreRound
  scoreRound --> patchDecision
  patchDecision --> emitRoundReport
```

## Guardrails

- Strict full-budget mode: execute all requested rounds.
- No pause-mode controls.
- No script-generated loop runners (`.py`, `.js`, `.sh`, or equivalent).
- No fixture recreation inside loop rounds.
- Patch decisions must cite observed failure signatures.

## Required outputs

- per-round report stream using `iteration-report-shape.md`
- cumulative trend summary
- patch ledger with signature linkage
- next-cycle recommendations
