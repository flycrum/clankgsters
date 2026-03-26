import type {
  ClankgsterAgentConfig,
  ClankgsterConfig,
} from '../configs/clankgster-config.schema.js';

/**
 * Defines agent queue shape consumed by `processAgentQueueMachine` and `processAgentBehaviorsMachine`.
 *
 * Invariants:
 * - Queue construction must stay deterministic (`Object.entries` order from resolved config object).
 */

export interface ClankgsterDefinedAgent {
  config: ClankgsterAgentConfig;
  name: string;
}

function toDefinedAgent(name: string, config: ClankgsterAgentConfig): ClankgsterDefinedAgent {
  return { name, config };
}

export const agentTypes = {
  /** Builds the agent queue from the resolved config object. */
  buildQueue(config: ClankgsterConfig): ClankgsterDefinedAgent[] {
    return Object.entries(config.agents).map(([name, agentConfig]) =>
      toDefinedAgent(name, agentConfig)
    );
  },
};
