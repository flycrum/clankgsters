# Purpose

Represents one behavior lifecycle as explicit machine states (`syncSetup`, `syncRun`, `syncTeardown`).

## Invariants

- One machine instance handles one `(agentName, behaviorName)` pair.
- `processAgentBehaviorsMachine` invokes this machine once per behavior, in order; agent order itself comes from `processAgentQueueMachine`.
