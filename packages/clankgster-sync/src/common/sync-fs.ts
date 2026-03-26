import fs from 'node:fs';
import path from 'node:path';

/** Shared filesystem utilities for sync behaviors and manifest teardown. */
export const syncFs = {
  /** Creates a directory recursively when missing. */
  ensureDir(dirPath: string): void {
    fs.mkdirSync(dirPath, { recursive: true });
  },
  /** Returns directory entries with basic type flags, or an empty list when unreadable. */
  readdirWithTypes(dirPath: string): Array<{
    isDirectory: boolean;
    isFile: boolean;
    isSymbolicLink: boolean;
    name: string;
  }> {
    try {
      return fs.readdirSync(dirPath, { withFileTypes: true }).map((entry) => ({
        isDirectory: entry.isDirectory(),
        isFile: entry.isFile(),
        isSymbolicLink: entry.isSymbolicLink(),
        name: entry.name,
      }));
    } catch {
      return [];
    }
  },
  /** Recursively returns POSIX relative file paths under `dirPath`. */
  walkFilePathsRecursive(dirPath: string): string[] {
    const files: string[] = [];
    const walk = (baseDir: string, relBase: string): void => {
      const entries = this.readdirWithTypes(baseDir);
      for (const entry of entries) {
        const rel = relBase.length > 0 ? `${relBase}/${entry.name}` : entry.name;
        const abs = path.join(baseDir, entry.name);
        if (entry.isDirectory) {
          walk(abs, rel);
          continue;
        }
        if (entry.isFile) files.push(rel);
      }
    };
    walk(dirPath, '');
    return files;
  },
  /** Returns whether `targetPath` currently exists. */
  pathExists(targetPath: string): boolean {
    return fs.existsSync(targetPath);
  },
  /** Returns whether a path is a symlink. */
  isSymlink(targetPath: string): boolean {
    try {
      return fs.lstatSync(targetPath).isSymbolicLink();
    } catch {
      return false;
    }
  },
  /** Returns whether a path is a file. */
  isFile(targetPath: string): boolean {
    try {
      return fs.statSync(targetPath).isFile();
    } catch {
      return false;
    }
  },
  /** Reads UTF-8 file contents. */
  readFileUtf8(filePath: string): string {
    return fs.readFileSync(filePath, 'utf8');
  },
  /** Writes UTF-8 file contents and ensures parent directories exist. */
  writeFileUtf8(filePath: string, contents: string): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    if (fs.existsSync(filePath)) {
      try {
        fs.chmodSync(filePath, 0o666);
      } catch {
        // best effort: chmod may fail on some filesystems
      }
    }
    fs.writeFileSync(filePath, contents, 'utf8');
  },
  /** Copies a file and ensures the destination parent directory exists. */
  copyFile(sourcePath: string, destinationPath: string): void {
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    if (fs.existsSync(destinationPath)) {
      try {
        fs.chmodSync(destinationPath, 0o666);
      } catch {
        // best effort
      }
    }
    fs.copyFileSync(sourcePath, destinationPath);
  },
  /** Marks a file read-only (best effort across platforms). */
  markFileReadOnly(filePath: string): void {
    try {
      fs.chmodSync(filePath, 0o444);
    } catch {
      // best effort
    }
  },
  /** Removes a file or symlink when present; no-op for ENOENT. */
  unlinkIfExists(targetPath: string): void {
    try {
      fs.lstatSync(targetPath);
      fs.unlinkSync(targetPath);
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== 'ENOENT') throw error;
    }
  },
  /** Removes file/symlink/directory if it exists. */
  removePathIfExists(targetPath: string): void {
    try {
      const stat = fs.lstatSync(targetPath);
      if (stat.isDirectory()) fs.rmSync(targetPath, { force: true, recursive: true });
      else fs.unlinkSync(targetPath);
    } catch {
      // idempotent best effort
    }
  },
  /** Creates a symlink at `linkPath` that points to `sourcePath` with a relative target path. */
  symlinkRelative(sourcePath: string, linkPath: string): void {
    if (!fs.existsSync(sourcePath)) return;
    fs.mkdirSync(path.dirname(linkPath), { recursive: true });
    try {
      const stat = fs.lstatSync(linkPath);
      if (stat.isDirectory()) fs.rmSync(linkPath, { force: true, recursive: true });
      else fs.unlinkSync(linkPath);
    } catch {
      // ignore missing destination
    }
    const relTarget = path.relative(path.dirname(linkPath), sourcePath);
    fs.symlinkSync(relTarget, linkPath);
  },
  /** Removes empty parent directories up to but not including `stopAtPath`. */
  pruneEmptyParentDirs(removedPath: string, stopAtPath: string): void {
    let currentDir = path.dirname(removedPath);
    const stop = path.resolve(stopAtPath);
    while (currentDir.length > 1) {
      const resolved = path.resolve(currentDir);
      if (resolved === stop) break;
      try {
        if (!fs.existsSync(resolved)) break;
        if (fs.readdirSync(resolved).length > 0) break;
        fs.rmdirSync(resolved);
        currentDir = path.dirname(resolved);
      } catch {
        break;
      }
    }
  },
};
