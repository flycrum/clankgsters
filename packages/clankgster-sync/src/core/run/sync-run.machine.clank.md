# Purpose

Top-level sync session machine coordinating config resolution, agent execution, and manifest persistence.

## Invariants

- Stage flow is linear: boot -> resolveConfig -> prepareDiscovery -> runAgents -> persistManifest -> done/failed.
- Child machine invocation boundaries are stable e2e observation points.
- Observation callback is optional and test-focused.
