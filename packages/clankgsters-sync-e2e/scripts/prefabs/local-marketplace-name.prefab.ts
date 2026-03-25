import { clankgstersConfigDefaults } from '../../../clankgsters-sync/config/index.js';
import { JsonFilePrefab } from './json-file-prefab.js';

export interface LocalMarketplaceNamePrefabOptions {
  /** Local marketplace name override; defaults to sourceDefaults.localMarketplaceName. */
  localMarketplaceName?: string;
  /** Optional marketplace file path; defaults to `.claude-plugin/marketplace.json`. */
  marketplaceFilePath?: string;
}

/** Writes a local marketplace JSON stub seeded with the configured marketplace name. */
export class LocalMarketplaceNamePrefab extends JsonFilePrefab {
  constructor(sandboxDirectoryName: string, options: LocalMarketplaceNamePrefabOptions = {}) {
    const localMarketplaceName =
      options.localMarketplaceName ??
      clankgstersConfigDefaults.CONSTANTS.sourceDefaults.localMarketplaceName;
    const marketplaceFilePath = options.marketplaceFilePath ?? '.claude-plugin/marketplace.json';
    const pathSegments = marketplaceFilePath.split('/').filter((segment) => segment.length > 0);
    const fileName = pathSegments.pop() ?? 'marketplace.json';
    super(sandboxDirectoryName, {
      fileName,
      jsonValue: {
        name: localMarketplaceName,
        owner: { name: 'clankgsters' },
        plugins: [],
      },
      parentPaths: pathSegments,
    });
  }
}
