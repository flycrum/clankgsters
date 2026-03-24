# Purpose

Defines source-layer abstraction for config loading with explicit source priority.

## Invariants

- Every source declares a unique `id`.
- Higher-priority sources load later and override earlier merged fields.
