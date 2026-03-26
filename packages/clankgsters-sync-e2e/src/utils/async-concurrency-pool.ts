/** Bounded async worker pool that processes items with at most `maxConcurrent` in flight. */
export const asyncConcurrencyPool = {
  async runLimited<TItem, TResult>(options: {
    items: readonly TItem[];
    maxConcurrent: number;
    worker: (item: TItem) => Promise<TResult>;
    onItemSettled?: (item: TItem, result: TResult) => Promise<void> | void;
  }): Promise<void> {
    const workerCount = this.resolveWorkerCount(options.items.length, options.maxConcurrent);
    if (workerCount === 0) return;

    let nextIndex = 0;
    const runWorker = async (): Promise<void> => {
      while (true) {
        const itemIndex = nextIndex;
        nextIndex += 1;
        if (itemIndex >= options.items.length) return;

        const item = options.items[itemIndex] as TItem;
        const result = await options.worker(item);
        await options.onItemSettled?.(item, result);
      }
    };

    await Promise.all(Array.from({ length: workerCount }, async () => runWorker()));
  },

  resolveWorkerCount(totalItems: number, maxConcurrent: number): number {
    if (totalItems <= 0) return 0;
    const normalizedMaxConcurrent = Number.isFinite(maxConcurrent)
      ? Math.max(1, Math.floor(maxConcurrent))
      : 1;
    return Math.min(totalItems, normalizedMaxConcurrent);
  },
} as const;
