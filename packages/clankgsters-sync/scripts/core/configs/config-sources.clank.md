# Purpose

Defines concrete config providers for team TS config, local TS config, and env overrides.

## Priority Order

- `clankgsters.config.ts` (team)
- `clankgsters.local.config.ts` (developer override)
- environment variables (highest priority)

## Invariants

- Missing local file is expected and should not fail config resolution.
