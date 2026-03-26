import { describe, expect, test } from 'vite-plus/test';
import { orderedCompletionBuffer } from './ordered-completion-buffer.js';

describe('orderedCompletionBuffer', () => {
  test('emits in ascending caseIndex order for reverse completion order', async () => {
    const emitted: Array<{ caseIndex: number; value: string }> = [];
    const buffer = orderedCompletionBuffer.create<string>({
      emit: (caseIndex, value) => {
        emitted.push({ caseIndex, value });
      },
    });

    await buffer.accept(4, 'case-4');
    await buffer.accept(3, 'case-3');
    await buffer.accept(2, 'case-2');
    expect(emitted).toHaveLength(0);

    await buffer.accept(1, 'case-1');
    expect(emitted.map((entry) => entry.caseIndex)).toEqual([1, 2, 3, 4]);
    expect(emitted.map((entry) => entry.value)).toEqual(['case-1', 'case-2', 'case-3', 'case-4']);
    expect(buffer.getNextExpectedIndex()).toBe(5);
    expect(buffer.getPendingCount()).toBe(0);
  });

  test('emits immediately when completions are already sequential', async () => {
    const emitted: number[] = [];
    const buffer = orderedCompletionBuffer.create<number>({
      emit: (caseIndex) => {
        emitted.push(caseIndex);
      },
    });

    await buffer.accept(1, 10);
    expect(emitted).toEqual([1]);
    await buffer.accept(2, 20);
    expect(emitted).toEqual([1, 2]);
    await buffer.accept(3, 30);
    expect(emitted).toEqual([1, 2, 3]);
  });

  test('supports single-case streams and rejects duplicate indices', async () => {
    const emitted: number[] = [];
    const buffer = orderedCompletionBuffer.create<number>({
      emit: (caseIndex) => {
        emitted.push(caseIndex);
      },
    });

    await buffer.accept(1, 100);
    expect(emitted).toEqual([1]);
    await expect(buffer.accept(1, 200)).rejects.toThrow(/already-emitted|duplicate completion/);
  });
});
