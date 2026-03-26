/** Result for one agent after `processAgentQueueMachine` runs that agent (success or failure for that queue item). */
export interface AgentQueueOutcome {
  /** Configured agent name (key under `ClankgsterConfig.agents`). */
  agent: string;
  /** Whether that agent’s pass completed without a terminal failure. */
  success: boolean;
}
