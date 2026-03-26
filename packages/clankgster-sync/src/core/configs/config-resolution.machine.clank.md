# Purpose

State machine for config loading lifecycle: source resolution, merge, and validated output.

## Invariants

- The machine output is always a validated `ClankgsterConfigResolutionDetails`.
- Errors remain in machine state for observability and retry support.

## Testing Guidance

- Keep a smoke test that reaches `done` with valid input.
- Keep an error-path test using an invalid source payload.
