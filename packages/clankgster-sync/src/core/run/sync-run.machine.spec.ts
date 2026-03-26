import { describe, expect, test, afterEach } from 'vite-plus/test';
import { createActor } from 'xstate';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { actorHelpers } from '../../common/actor-helpers.js';
import { syncRunMachine } from './sync-run.machine.js';

const fixtureSandboxSource = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '__fixtures__/sync-run-sandbox'
);

const teardownRoots: string[] = [];

afterEach(() => {
  while (teardownRoots.length > 0) {
    const root = teardownRoots.pop()!;
    if (fs.existsSync(root)) fs.rmSync(root, { recursive: true, force: true });
  }
});

function createSandboxRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-run-machine-spec-'));
  teardownRoots.push(root);
  fs.cpSync(fixtureSandboxSource, root, { recursive: true });
  return root;
}

describe('syncRunMachine', () => {
  test('completes sync mode', async () => {
    const repoRoot = createSandboxRoot();
    const actor = createActor(syncRunMachine, {
      input: {
        mode: 'sync',
        repoRoot,
      },
    });
    actor.start();
    const output = await actorHelpers.awaitOutput<{
      errorMessage: string | null;
      outcomes: { agent: string; success: boolean }[];
      success: boolean;
    }>(actor);
    const success = output.success ?? output.errorMessage == null;
    expect(success).toBe(true);
  });

  test('completes clear mode', async () => {
    const repoRoot = createSandboxRoot();
    const actor = createActor(syncRunMachine, {
      input: {
        mode: 'clear',
        repoRoot,
      },
    });
    actor.start();
    const output = await actorHelpers.awaitOutput<{
      errorMessage: string | null;
      outcomes: { agent: string; success: boolean }[];
      success: boolean;
    }>(actor);
    const success = output.success ?? output.errorMessage == null;
    expect(success).toBe(true);
    expect(fs.existsSync(path.join(repoRoot, '.clankgster-cache', 'sync-manifest.json'))).toBe(
      false
    );
    expect(fs.existsSync(path.join(repoRoot, '.clankgster-cache'))).toBe(false);
  });
});
