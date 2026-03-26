/** Result of executing one sync behavior for an agent (e.g. rules, commands). */
export interface SyncBehaviorOutcome {
  /** Agent name this behavior belongs to. */
  agent: string;
  /** Config `behaviorName` / preset class name (e.g. `AgentRulesDirectorySyncPreset`). */
  behaviorName: string;
  /** Whether this behavior’s machine finished without a terminal failure. */
  success: boolean;
}
