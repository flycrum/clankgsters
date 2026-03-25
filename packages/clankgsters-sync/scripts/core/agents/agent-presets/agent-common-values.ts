import { claudeAgentPresetConstants } from './claude-agent-preset.js';
import { codexAgentPresetConstants } from './codex-agent-preset.js';
import { cursorAgentPresetConstants } from './cursor-agent-preset.js';

/** Runtime common values shared from built-in agent presets to sync behavior context. */
export interface AgentCommonValues {
  /** Default markdown context output filename for this agent, or `null` when not defined. */
  markdownContextFileName: string | null;
  /** Plugin manifest directory for this agent; undefined means caller should use fallback naming. */
  agentPluginManifestDir: string | null | undefined;
}

const BUILT_IN_AGENT_COMMON_VALUES: Record<string, AgentCommonValues> = {
  [claudeAgentPresetConstants.COMMON.AGENT_NAME]: {
    agentPluginManifestDir: claudeAgentPresetConstants.COMMON.AGENT_PLUGIN_MANIFEST_DIR,
    markdownContextFileName: claudeAgentPresetConstants.COMMON.AGENT_MARKDOWN_CONTEXT_FILE_NAME,
  },
  [codexAgentPresetConstants.COMMON.AGENT_NAME]: {
    agentPluginManifestDir: codexAgentPresetConstants.COMMON.AGENT_PLUGIN_MANIFEST_DIR,
    markdownContextFileName: codexAgentPresetConstants.COMMON.AGENT_MARKDOWN_CONTEXT_FILE_NAME,
  },
  [cursorAgentPresetConstants.COMMON.AGENT_NAME]: {
    agentPluginManifestDir: cursorAgentPresetConstants.COMMON.AGENT_PLUGIN_MANIFEST_DIR,
    markdownContextFileName: cursorAgentPresetConstants.COMMON.AGENT_MARKDOWN_CONTEXT_FILE_NAME,
  },
};

/** Resolves shared common values for one agent name with safe fallback defaults for custom agents. */
export const agentCommonValues = {
  /** Returns built-in common values, or fallback defaults for custom agent names. */
  resolve(agentName: string): AgentCommonValues {
    const values = BUILT_IN_AGENT_COMMON_VALUES[agentName];
    if (values != null) return values;
    return {
      agentPluginManifestDir: undefined,
      markdownContextFileName: null,
    };
  },
};
