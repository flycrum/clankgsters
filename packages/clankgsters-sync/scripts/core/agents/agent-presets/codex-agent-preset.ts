import type { ClankgstersAgentConfig } from '../../configs/clankgsters-config.schema.js';
import { codexAgentPresetConfig } from './codex-agent-preset.config.js';

const { CONSTANTS } = codexAgentPresetConfig;

/** Default Codex preset behaviors for sync runs. */
export const codexAgentPreset: ClankgstersAgentConfig = {
  enabled: true,
  behaviors: [
    {
      enabled: true,
      behaviorName: 'MarkdownSymlinkSyncPreset',
      options: {
        targetFile: CONSTANTS.MARKDOWN_CONTEXT_TARGET_FILE_NAME,
        gitignoreComment: CONSTANTS.GITIGNORE_COMMENT,
        gitignoreEntry: CONSTANTS.GITIGNORE_ENTRY,
      },
    },
    { enabled: true, behaviorName: 'SkillsDirectorySyncPreset', options: {} },
    {
      enabled: true,
      behaviorName: 'MarkdownSectionSyncPreset',
      options: {
        agentsFile: CONSTANTS.MARKDOWN_SECTION_FILE,
        sectionHeading: CONSTANTS.MARKDOWN_SECTION_HEADING,
      },
    },
  ],
};
