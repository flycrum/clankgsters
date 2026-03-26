import type { ClankgsterAgentConfig } from '../configs/clankgster-config.schema.js';
import { claudeAgentPreset } from './agent-presets/claude-agent-preset.js';
import { codexAgentPreset } from './agent-presets/codex-agent-preset.js';
import { cursorAgentPreset } from './agent-presets/cursor-agent-preset.js';

/**
 * Default preset definitions for common coding agents.
 *
 * Invariants:
 * - Keep behaviors declarative and ordered.
 * - Presets should be overridable by config layers.
 */
export const agentPresets = {
  claude: claudeAgentPreset,
  cursor: cursorAgentPreset,
  codex: codexAgentPreset,
} satisfies Record<string, ClankgsterAgentConfig>;
