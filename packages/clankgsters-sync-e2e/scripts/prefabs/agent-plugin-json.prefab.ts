import { JsonFilePrefab } from './json-file-prefab.js';

export interface AgentPluginJsonPrefabOptions {
  /** Plugin directory name under the plugins root. */
  pluginDirName: string;
  /** Agent plugin manifest directory (e.g. `.claude-plugin`, `.cursor-plugin`). */
  pluginManifestDirName: string;
  /** Optional plugin manifest `name`; defaults to `pluginDirName`. */
  pluginName?: string;
  /** Optional plugin `version`. */
  version?: string;
  /** Optional plugin `description`. */
  description?: string;
  /** Optional source dir override; defaults to `.clank`. */
  sourceDirName?: string;
  /** Optional plugins dir override; defaults to `plugins`. */
  pluginsDirName?: string;
  /** Optional parent prefixes before source dir (for nested package roots). */
  parentPaths?: string[];
}

/** Writes one agent-specific plugin manifest JSON used by marketplace discovery. */
export class AgentPluginJsonPrefab extends JsonFilePrefab {
  constructor(sandboxDirectoryName: string, options: AgentPluginJsonPrefabOptions) {
    const sourceDirName = options.sourceDirName ?? '.clank';
    const pluginsDirName = options.pluginsDirName ?? 'plugins';
    super(sandboxDirectoryName, {
      fileName: 'plugin.json',
      jsonValue: {
        description: options.description ?? `${options.pluginDirName} plugin`,
        name: options.pluginName ?? options.pluginDirName,
        version: options.version ?? '0.0.1',
      },
      parentPaths: [
        ...(options.parentPaths ?? []),
        sourceDirName,
        pluginsDirName,
        options.pluginDirName,
        options.pluginManifestDirName,
      ],
    });
  }
}
