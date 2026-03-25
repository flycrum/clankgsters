import fs from 'node:fs';
import path from 'node:path';
import type { PrefabApplyContext, PrefabExecutable } from './prefab-types.js';

/**
 * Base class for all e2e seeding prefabs.
 * Provides protected fs/path helpers so subclasses avoid repeated utility imports.
 */
export abstract class PrefabBase<
  TOptions extends object = Record<string, never>,
> implements PrefabExecutable {
  constructor(
    /** Sandbox directory name under one case output directory. */
    protected readonly sandboxDirectoryName: string,
    /** Prefab-specific options object (second ctor arg by convention for all prefabs). */
    protected readonly options: TOptions
  ) {}

  /** Applies one prefab to the current case output root. */
  abstract apply(context: PrefabApplyContext): void;

  /** Absolute sandbox root for this prefab in the current case. */
  protected getSandboxRoot(context: PrefabApplyContext): string {
    return path.join(context.caseOutputRoot, this.sandboxDirectoryName);
  }

  /** Joins a path under this prefab sandbox root. */
  protected joinSandboxPath(context: PrefabApplyContext, ...segments: string[]): string {
    return path.join(this.getSandboxRoot(context), ...segments);
  }

  /** Ensures a directory exists recursively. */
  protected ensureDirectory(dirPath: string): void {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  /** Writes utf8 text after creating the parent directory. */
  protected writeTextFile(filePath: string, contents: string): void {
    this.ensureDirectory(path.dirname(filePath));
    fs.writeFileSync(filePath, contents, 'utf8');
  }

  /** Writes JSON with trailing newline after creating the parent directory. */
  protected writeJsonFile(filePath: string, value: unknown): void {
    this.writeTextFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
  }
}
