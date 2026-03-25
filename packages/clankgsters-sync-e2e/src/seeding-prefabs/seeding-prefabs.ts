import { DefaultSandboxSeedingBlueprint } from './blueprints/default-sandbox-seeding-blueprint.js';
import { MarkdownContextScenarioSeedingBlueprint } from './blueprints/markdown-context-scenario-seeding-blueprint.js';
import { PluginsSkillsScenarioSeedingBlueprint } from './blueprints/plugins-skills-scenario-seeding-blueprint.js';
import { SourceLayoutVariantsSeedingBlueprint } from './blueprints/source-layout-variants-seeding-blueprint.js';
import { AgentPluginJsonSeedingPrefab } from './prefabs/agent-plugin-json-seeding-prefab.js';
import { DirectorySeedingPrefab } from './prefabs/directory-seeding-prefab.js';
import { FileSeedingPrefab } from './prefabs/file-seeding-prefab.js';
import { JsonFileSeedingPrefab } from './prefabs/json-file-seeding-prefab.js';
import { LocalMarketplaceNameSeedingPrefab } from './prefabs/local-marketplace-name-seeding-prefab.js';
import { MarkdownContextFileNameSeedingPrefab } from './prefabs/markdown-context-file-name-seeding-prefab.js';
import { MarkdownFileSeedingPrefab } from './prefabs/markdown-file-seeding-prefab.js';
import { PluginCommandMarkdownSeedingPrefab } from './prefabs/plugin-command-markdown-seeding-prefab.js';
import { PluginRuleMarkdownSeedingPrefab } from './prefabs/plugin-rule-markdown-seeding-prefab.js';
import { PluginSkillFileSeedingPrefab } from './prefabs/plugin-skill-file-seeding-prefab.js';
import { PluginsDirSeedingPrefab } from './prefabs/plugins-dir-seeding-prefab.js';
import { PluginsLocalDirSeedingPrefab } from './prefabs/plugins-local-dir-seeding-prefab.js';
import { SkillFileNameSeedingPrefab } from './prefabs/skill-file-name-seeding-prefab.js';
import { SkillsDirSeedingPrefab } from './prefabs/skills-dir-seeding-prefab.js';
import { SkillsLocalDirSeedingPrefab } from './prefabs/skills-local-dir-seeding-prefab.js';
import { SourceDirSeedingPrefab } from './prefabs/source-dir-seeding-prefab.js';
import {
  type TestCaseSeedingPrefabItem,
  seedingPrefabOrchestration,
} from './seeding-prefab-orchestration.js';
import type { SeedingPrefabApplyContext } from './seeding-prefab-orchestration.types.js';

const SEEDING_PREFAB_CLASSES = [
  AgentPluginJsonSeedingPrefab,
  DirectorySeedingPrefab,
  FileSeedingPrefab,
  JsonFileSeedingPrefab,
  LocalMarketplaceNameSeedingPrefab,
  MarkdownContextFileNameSeedingPrefab,
  MarkdownFileSeedingPrefab,
  PluginCommandMarkdownSeedingPrefab,
  PluginRuleMarkdownSeedingPrefab,
  PluginSkillFileSeedingPrefab,
  PluginsDirSeedingPrefab,
  PluginsLocalDirSeedingPrefab,
  SkillFileNameSeedingPrefab,
  SkillsDirSeedingPrefab,
  SkillsLocalDirSeedingPrefab,
  SourceDirSeedingPrefab,
] as const;

const SEEDING_BLUEPRINT_CLASSES = [
  DefaultSandboxSeedingBlueprint,
  MarkdownContextScenarioSeedingBlueprint,
  PluginsSkillsScenarioSeedingBlueprint,
  SourceLayoutVariantsSeedingBlueprint,
] as const;

export const seedingPrefabs = {
  registries: {
    seedingBlueprintClasses: SEEDING_BLUEPRINT_CLASSES,
    seedingPrefabClasses: SEEDING_PREFAB_CLASSES,
  },
  api: {
    applySequentially(
      items: TestCaseSeedingPrefabItem[],
      context: SeedingPrefabApplyContext
    ): void {
      seedingPrefabOrchestration.applySeeding(context, items);
    },
  },
} as const;
