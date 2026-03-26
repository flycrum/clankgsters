import { AgentMarketplaceJsonSyncPreset } from './presets/agent-marketplace-json-sync-preset.js';
import { AgentRulesDirectorySyncPreset } from './presets/agent-rules-symlink-sync-preset.js';
import { AgentSettingsSyncPreset } from './presets/agent-settings-sync-preset.js';
import { MarkdownSectionSyncPreset } from './presets/markdown-section-sync-preset.js';
import { MarkdownContextSyncPreset } from './presets/markdown-symlink-sync-preset.js';
import { PluginsCacheBustSyncPreset } from './presets/plugins-cache-bust-sync-preset.js';
import { PluginsDirectorySyncPreset } from './presets/plugins-directory-sync-preset.js';
import { SkillsDirectorySyncPreset } from './presets/skills-directory-sync-preset.js';
import type { SyncBehaviorClassRef } from './sync-behavior-base.js';

const SYNC_BEHAVIOR_PRESET_CLASSES: SyncBehaviorClassRef[] = [
  AgentMarketplaceJsonSyncPreset,
  AgentRulesDirectorySyncPreset,
  AgentSettingsSyncPreset,
  MarkdownContextSyncPreset,
  MarkdownSectionSyncPreset,
  PluginsCacheBustSyncPreset,
  PluginsDirectorySyncPreset,
  SkillsDirectorySyncPreset,
];

/** Built-in behavior preset registry: `behaviorName` must equal each class’s `name` (e.g. `PluginsCacheBustSyncPreset`). */
export const syncBehaviorRegistry = {
  /** Looks up a behavior preset by its class name (e.g. `PluginsCacheBustSyncPreset`). */
  resolve(behaviorName: string): SyncBehaviorClassRef | null {
    const found = SYNC_BEHAVIOR_PRESET_CLASSES.find((Ctor) => Ctor.name === behaviorName);
    return found ?? null;
  },
};
