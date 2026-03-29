# Improvement application policy

Policy for applying post-iteration changes in `rawdocs-refine-test-iterative-syncs`.

## Core rule

Every applied patch must map to one or more failure signatures from the current iteration report.

Do not apply speculative changes without evidence.

## Bias ladder (highest priority first)

1. `skills/struct-sync/SKILL.md`
2. `skills/struct-sync/references/*.md`
3. `references/rawdocs-structify-architecture.md` and `references/rawdocs-sync-goals.md`
4. `skills/test-iterative-syncs-loop-round/SKILL.md` and related test references (rare)

## When test harness changes are allowed

Only allow harness changes when at least one is true:

- report shape is missing data needed to diagnose sync behavior
- mutation controls are too weak to reproduce a failure pattern
- continuity flow steps are ambiguous and produce inconsistent evidence

Harness changes must explicitly state why equivalent `struct-sync` improvements could not solve the issue.

## Required patch record fields

For each patch:

1. `patch_id`
2. target file(s)
3. linked failure signature(s)
4. why this patch is expected to improve next iteration outcome
5. risk notes (possible regressions or side effects)

## Patch size guidance

- Prefer small, testable deltas.
- Avoid multi-concern refactors in one iteration.
- If a larger change is required, stage it over consecutive iterations and measure impact.

## Stop and escalate conditions

Stop and request user decision if:

- two consecutive iterations worsen all primary goals
- proposed patch requires broad changes outside rawdocs sync scope
- goals conflict cannot be resolved without policy trade-offs
