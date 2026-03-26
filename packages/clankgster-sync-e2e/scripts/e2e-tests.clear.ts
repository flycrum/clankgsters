import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { e2ePathHelpers } from '../src/common/e2e-path-helpers.js';

/** Removes e2e `.e2e-tests.run-results` directory so case outputs can be regenerated from scratch. */
function main(): void {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const packageRoot = path.resolve(scriptDir, '..');
  const resultsRoot = e2ePathHelpers.getResultsRoot(packageRoot);
  if (fs.existsSync(resultsRoot)) {
    fs.rmSync(resultsRoot, { recursive: true, force: true });
  }
}

main();
