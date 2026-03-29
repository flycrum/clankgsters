# Iteration report shape

Each iteration report must include all sections below.

## 1) Iteration context

- `iteration_id`
- `target_plugin_path`
- `iteration_budget`
- strict full-budget mode state

## 2) Mutation profile

- chosen `file-qualifier`
- chosen `file-modifier` set
- chosen `file-modifier-qualifier`
- chosen `fs-modifier` set
- short rationale for why this mutation profile was chosen now

## 3) Run outputs

- run-1 non-`rawdocs/` snapshot (compact)
- run-2 non-`rawdocs/` snapshot (compact)
- run-1 tiny trace map
- run-2 tiny trace map
- churn severity (`none`/`low`/`medium`/`high`)
- loop execution proof (`round_started`, `round_finished`)

## 4) Bucket placement snapshot

Provide output counts and notable files per bucket:

- `rules/`
- `skills/`
- `references/`
- `docs/`
- `commands/`
- `agents/`
- `hooks/`

Explicitly flag suspected mis-bucketing.

## 5) Goal scorecard

Score each item in [`sync-goals-and-bucketing-criteria.md`](sync-goals-and-bucketing-criteria.md) as:

- `pass`
- `partial`
- `fail`

Include evidence lines for any `partial` or `fail`.

## 6) Failure signatures

List concrete failure signatures observed this iteration. Examples:

- orphan retention despite subtractive expectation
- continuity thrash on traceable paths
- `references/` files without inbound links
- excessive `docs/` placement for agent-targeted context

## 7) Patch plan and applied changes

- candidate improvements considered
- selected improvements
- files modified
- why each patch maps to failure signatures
- note whether patch targets `struct-sync` or test harness

## 8) Trend update

Track running trends across completed iterations:

- continuity stability trend
- subtractive honesty trend
- bucket-fit trend
- net recommendation confidence trend
