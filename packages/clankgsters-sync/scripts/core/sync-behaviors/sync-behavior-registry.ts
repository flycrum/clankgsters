import { LocalPluginCacheBustPreset } from './presets/local-plugin-cache-bust-preset.js';
import { LocalPluginsContentSyncPreset } from './presets/local-plugins-content-sync-preset.js';
import { MarkdownContextSymlinkSyncPreset } from './presets/markdown-context-symlink-sync-preset.js';
import { MarkdownSectionSyncPreset } from './presets/markdown-section-sync-preset.js';
import { MarketplaceJsonSyncPreset } from './presets/marketplace-json-sync-preset.js';
import { RulesSymlinkSyncPreset } from './presets/rules-symlink-sync-preset.js';
import { SettingsSyncPreset } from './presets/settings-sync-preset.js';
import { SkillsDirectorySyncPreset } from './presets/skills-directory-sync-preset.js';
import type { SyncBehaviorClassRef } from './sync-behavior-base.js';

const SYNC_BEHAVIOR_PRESETS: SyncBehaviorClassRef[] = [
  LocalPluginCacheBustPreset,
  LocalPluginsContentSyncPreset,
  MarkdownContextSymlinkSyncPreset,
  MarkdownSectionSyncPreset,
  MarketplaceJsonSyncPreset,
  RulesSymlinkSyncPreset,
  SettingsSyncPreset,
  SkillsDirectorySyncPreset,
];

/** Built-in behavior preset registry: `behaviorName` must equal each class’s `name` (e.g. `LocalPluginCacheBustPreset`). */
export const syncBehaviorRegistry = {
  resolve(behaviorName: string): SyncBehaviorClassRef | null {
    const found = SYNC_BEHAVIOR_PRESETS.find((Ctor) => Ctor.name === behaviorName);
    return found ?? null;
  },
};
