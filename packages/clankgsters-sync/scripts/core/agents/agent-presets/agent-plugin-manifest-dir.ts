const FALLBACK_AGENT_NAME_PATTERN = /^[a-z0-9-]+$/;

/** Resolves plugin manifest directory for one agent from resolved constants with safe fallback naming. */
export const agentPluginManifestDir = {
  /** Returns configured manifest directory, explicit null, or fallback `.${agentName}-plugin` for safe custom names. */
  resolve(agentName: string, agentPluginManifestDir: string | null | undefined): string | null {
    if (typeof agentPluginManifestDir === 'string') return agentPluginManifestDir;
    if (agentPluginManifestDir === null) return null;
    if (!FALLBACK_AGENT_NAME_PATTERN.test(agentName)) {
      throw new Error(
        `Invalid agentName for plugin manifest dir fallback: ${JSON.stringify(agentName)}; allowed pattern is ${String(FALLBACK_AGENT_NAME_PATTERN)} (lowercase letters, digits, hyphens only)`
      );
    }
    return `.${agentName}-plugin`;
  },
};
