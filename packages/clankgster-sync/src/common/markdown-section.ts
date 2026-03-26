import { err, ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import path from 'node:path';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function headingLevel(line: string): number {
  const match = line.trim().match(/^(#{1,6})\s/);
  return match?.[1]?.length ?? 0;
}

/** Markdown section manipulation helpers used by sync behaviors. */
export const markdownSection = {
  /** Replaces a heading section or appends it when absent. */
  replaceOrAddSection(
    filePath: string,
    heading: string,
    sectionContent: string
  ): Result<void, Error> {
    try {
      const headingRegex = new RegExp(`^(#{1,6})\\s+${escapeRegExp(heading)}\\s*$`, 'i');
      const source = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
      const lines = source.split(/\r?\n/);
      const startIndex = lines.findIndex((line) => headingRegex.test(line.trim()));
      const level = startIndex >= 0 ? headingLevel(lines[startIndex] ?? '') : 2;
      const block = [`${'#'.repeat(level)} ${heading}`, '', sectionContent.trim(), ''].join('\n');

      const nextLines: string[] = [];
      if (startIndex < 0) {
        const trimmed = source.trim();
        if (trimmed.length > 0) nextLines.push(trimmed, '', block);
        else nextLines.push(block);
      } else {
        let endIndex = startIndex + 1;
        while (endIndex < lines.length) {
          const lineLevel = headingLevel(lines[endIndex] ?? '');
          if (lineLevel > 0 && lineLevel <= level) break;
          endIndex += 1;
        }
        nextLines.push(...lines.slice(0, startIndex), block, ...lines.slice(endIndex));
      }

      const normalized = nextLines
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, normalized.length > 0 ? `${normalized}\n` : '', 'utf8');
      return ok(undefined);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  },
  /** Removes a heading section and leaves the rest of the markdown file untouched. */
  removeSection(filePath: string, heading: string): Result<void, Error> {
    try {
      if (!fs.existsSync(filePath)) return ok(undefined);
      const headingRegex = new RegExp(`^(#{1,6})\\s+${escapeRegExp(heading)}\\s*$`, 'i');
      const source = fs.readFileSync(filePath, 'utf8');
      const lines = source.split(/\r?\n/);
      const startIndex = lines.findIndex((line) => headingRegex.test(line.trim()));
      if (startIndex < 0) return ok(undefined);
      const level = headingLevel(lines[startIndex] ?? '');

      let endIndex = startIndex + 1;
      while (endIndex < lines.length) {
        const lineLevel = headingLevel(lines[endIndex] ?? '');
        if (lineLevel > 0 && lineLevel <= level) break;
        endIndex += 1;
      }
      const normalized = [...lines.slice(0, startIndex), ...lines.slice(endIndex)]
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      fs.writeFileSync(filePath, normalized.length > 0 ? `${normalized}\n` : '', 'utf8');
      return ok(undefined);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  },
};
