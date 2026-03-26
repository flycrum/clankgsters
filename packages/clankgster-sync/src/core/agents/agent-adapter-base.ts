import { ok, type Result } from 'neverthrow';
import { clankLogger } from '../../common/logger.js';

export interface AgentLifecycleContext {
  /** Agent key from config (`ClankgsterConfig.agents`). */
  agentName: string;
  /** Sync run mode passed through from the top-level machine. */
  mode: 'sync' | 'clear';
}

/** Chains `Result<void, Error>` steps with `andThen` (short-circuits on first `Err`). */
class LifecycleChain {
  /** Running accumulator; starts at `ok(undefined)`. */
  private current: Result<void, Error> = ok(undefined);

  /** Appends `step` to the chain and returns `this` for fluent use. */
  run(step: () => Result<void, Error>): LifecycleChain {
    this.current = this.current.andThen(step);
    return this;
  }

  /**
   * Always runs `step` (e.g. {@link AgentAdapterBase.syncTeardownAfter} in {@link AgentAdapterBase.runLifecycle}).
   * If the chain already failed, the first `Err` is kept and `step`’s result is ignored so cleanup still runs but the primary failure is preserved
   */
  runAlways(step: () => Result<void, Error>): LifecycleChain {
    const stepResult = step();
    if (this.current.isErr()) return this;
    this.current = stepResult;
    return this;
  }

  /** The composed result after all chained steps. */
  toResult(): Result<void, Error> {
    return this.current;
  }
}

/**
 * Neverthrow-based adapter lifecycle skeleton for `processAgentBehaviorsMachine` sync orchestration.
 *
 * Invariants:
 * - Keep lifecycle ordering explicit and deterministic.
 * - Hook implementations should stay side-effect-light in architecture phase.
 */
export class AgentAdapterBase {
  /** Runs once before `syncRun`; use for prep (defaults to no-op `ok`). */
  syncSetupBefore(_context: AgentLifecycleContext): Result<void, Error> {
    return ok(undefined);
  }

  /** Main adapter work for the current `mode` (defaults to no-op `ok`). */
  syncRun(_context: AgentLifecycleContext): Result<void, Error> {
    return ok(undefined);
  }

  /** Runs once after `syncRun`; use for cleanup (defaults to no-op `ok`). */
  syncTeardownAfter(_context: AgentLifecycleContext): Result<void, Error> {
    return ok(undefined);
  }

  /**
   * Runs {@link syncSetupBefore} then {@link syncRun} (short-circuit on first `Err`), then always {@link syncTeardownAfter}.
   * Teardown runs even when setup or run failed; the returned `Result` is still the first failure from setup/run, or teardown’s `Err` if those succeeded
   */
  runLifecycle(context: AgentLifecycleContext): Result<void, Error> {
    clankLogger
      .getLogger()
      .info({ agent: context.agentName, mode: context.mode }, 'agent lifecycle');
    return new LifecycleChain()
      .run(() => this.syncSetupBefore(context))
      .run(() => this.syncRun(context))
      .runAlways(() => this.syncTeardownAfter(context))
      .toResult();
  }
}

export const agentAdapterBase = {
  /** Returns a fresh `AgentAdapterBase` (subclasses can override via future factory wiring). */
  create(): AgentAdapterBase {
    return new AgentAdapterBase();
  },
};
