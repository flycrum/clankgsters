import {
  clankgstersConfigDefaults,
  clankgstersIdentity,
} from '../../../../clankgsters-sync/src/index.js';
import { JsonFileSeedingPrefab } from './json-file-seeding-prefab.js';

export interface LocalMarketplaceNameSeedingPrefabOptions {
  /** Marketplace name written into the stub `marketplace.json` (defaults to `sourceDefaults.localMarketplaceName`). */
  localMarketplaceName?: string;
  /** Relative path under sandbox for the marketplace file (default `.claude-plugin/marketplace.json`). */
  marketplaceFilePath?: string;
}

/**
 * When to use: Your test checks local marketplace naming or reads `.claude-plugin/marketplace.json` (or a custom path) and you only need a stub, not a full marketplace.
 * Strategic: seeds a minimal local marketplace JSON so tests can assert marketplace name resolution without a full plugin graph.
 */
export class LocalMarketplaceNameSeedingPrefab extends JsonFileSeedingPrefab {
  /**
   * Tactical: splits `marketplaceFilePath` into parent segments and filename, then writes name/owner/plugins stub JSON.
   * Desired outcome: a stub marketplace file such as `.claude-plugin/marketplace.json` with `{ name, owner, plugins: [] }` for name-resolution tests.
   */
  constructor(
    sandboxDirectoryName: string,
    options: LocalMarketplaceNameSeedingPrefabOptions = {}
  ) {
    const localMarketplaceName =
      options.localMarketplaceName ??
      clankgstersConfigDefaults.CONSTANTS.sourceDefaults.localMarketplaceName;
    const marketplaceFilePath =
      options.marketplaceFilePath ??
      `${clankgstersIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME}/marketplace.json`;
    const pathSegments = marketplaceFilePath
      .replace(/\\/g, '/')
      .split('/')
      .filter((segment) => segment.length > 0);
    const fileName = pathSegments.pop() ?? 'marketplace.json';
    super(sandboxDirectoryName, {
      fileName,
      jsonValue: { name: localMarketplaceName, owner: { name: 'clankgsters' }, plugins: [] },
      parentPaths: pathSegments,
    });
  }
}
