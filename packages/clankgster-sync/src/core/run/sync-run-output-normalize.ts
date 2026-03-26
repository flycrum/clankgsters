import type { AgentQueueOutcome } from '../agents/agent-queue-outcome.js';

/** Stable shape for sync-run machine output used by CLI entrypoints. */
export interface SyncRunOutputNormalized {
  errorMessage: string | null;
  outcomes: AgentQueueOutcome[];
  success: boolean;
}

/** Machine output before normalization: same fields as {@link SyncRunOutputNormalized}, all optional. */
export type SyncRunOutputPartial = Partial<SyncRunOutputNormalized>;

export const syncRunOutputNormalize = {
  /** Normalizes optional machine output fields into a stable shape. */
  normalize(output: SyncRunOutputPartial): SyncRunOutputNormalized {
    return {
      errorMessage: output.errorMessage ?? null,
      outcomes: output.outcomes ?? [],
      success: output.success ?? output.errorMessage == null,
    };
  },
};
