import fs from 'node:fs';
import path from 'node:path';
import { fsHelpers } from '../common/fs-helpers.js';
import type {
  SeedingPrefabApplyContext,
  SeedingPrefabsPrepareConfig,
} from './seeding-prefab-orchestration.types.js';

export abstract class SeedingPrefabBase<TOptions extends object = Record<string, never>> {
  constructor(
    public readonly sandboxDirectoryName: string,
    public readonly options: TOptions
  ) {}

  prepare(_context: SeedingPrefabApplyContext): SeedingPrefabsPrepareConfig {
    return {
      groups: [
        {
          action: 'append',
          entries: [
            {
              action: 'append',
              id: `${this.constructor.name}.materialize`,
              run: (runContext) => this.run(runContext),
            },
          ],
          id: this.constructor.name,
        },
      ],
    };
  }

  abstract run(context: SeedingPrefabApplyContext): void;

  protected getSandboxRoot(context: SeedingPrefabApplyContext): string {
    return fsHelpers.joinRootSafe(context.caseOutputRoot, this.sandboxDirectoryName);
  }

  protected joinSandboxPath(context: SeedingPrefabApplyContext, ...segments: string[]): string {
    return fsHelpers.joinRootSafe(this.getSandboxRoot(context), ...segments);
  }

  protected ensureDirectory(dirPath: string): void {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  protected writeTextFile(filePath: string, contents: string): void {
    this.ensureDirectory(path.dirname(filePath));
    fs.writeFileSync(filePath, contents, 'utf8');
  }

  protected writeJsonFile(filePath: string, value: unknown): void {
    this.writeTextFile(
      filePath,
      `${JSON.stringify(value, null, 2)}
`
    );
  }
}
