import { describe, expect, test } from 'vite-plus/test';
import { asyncConcurrencyPool } from './async-concurrency-pool.js';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('asyncConcurrencyPool', () => {
  test('never exceeds configured max concurrency and runs all items', async () => {
    const items = [1, 2, 3, 4, 5, 6];
    const delaysByItem = new Map<number, number>([
      [1, 35],
      [2, 5],
      [3, 30],
      [4, 10],
      [5, 25],
      [6, 15],
    ]);
    const completionOrder: number[] = [];
    let active = 0;
    let maxActive = 0;

    await asyncConcurrencyPool.runLimited({
      items,
      maxConcurrent: 3,
      worker: async (item) => {
        active += 1;
        maxActive = Math.max(maxActive, active);
        await sleep(delaysByItem.get(item) ?? 1);
        active -= 1;
        return item;
      },
      onItemSettled: (_item, result) => {
        completionOrder.push(result);
      },
    });

    expect(maxActive).toBeLessThanOrEqual(3);
    expect(completionOrder).toHaveLength(items.length);
    expect(new Set(completionOrder)).toEqual(new Set(items));
    expect(active).toBe(0);
  });

  test('resolveWorkerCount clamps values to valid worker limits', () => {
    expect(asyncConcurrencyPool.resolveWorkerCount(0, 4)).toBe(0);
    expect(asyncConcurrencyPool.resolveWorkerCount(4, 10)).toBe(4);
    expect(asyncConcurrencyPool.resolveWorkerCount(4, 0)).toBe(1);
    expect(asyncConcurrencyPool.resolveWorkerCount(4, Number.NaN)).toBe(1);
  });
});
