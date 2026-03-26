/**
 * Reorders out-of-order completions into a contiguous index stream.
 * Indexes are expected to be integer values starting at `firstExpectedIndex`.
 */
export const orderedCompletionBuffer = {
  /** Creates a new ordered completion buffer starting at index `1` unless explicitly overridden. */
  create<TResult>(options: {
    firstExpectedIndex?: number;
    emit: (caseIndex: number, result: TResult) => Promise<void> | void;
  }) {
    return new OrderedCompletionBuffer(options.firstExpectedIndex ?? 1, options.emit);
  },
} as const;

/** Holds out-of-order completions and emits them only when contiguous from `nextExpectedIndex`. */
class OrderedCompletionBuffer<TResult> {
  /** Stashes completed results keyed by `caseIndex` until they become emit-ready. */
  private readonly pendingByIndex = new Map<number, TResult>();
  /** The next index that must be emitted to preserve deterministic ordering. */
  private nextExpectedIndex: number;
  /** Callback invoked for each drained completion in strict ascending index order. */
  private readonly emit: (caseIndex: number, result: TResult) => Promise<void> | void;

  constructor(
    firstExpectedIndex: number,
    emit: (caseIndex: number, result: TResult) => Promise<void> | void
  ) {
    this.nextExpectedIndex = Number.isFinite(firstExpectedIndex)
      ? Math.max(1, Math.floor(firstExpectedIndex))
      : 1;
    this.emit = emit;
  }

  /** Accepts a completion and drains any now-contiguous buffered range. */
  async accept(caseIndex: number, result: TResult): Promise<void> {
    if (!Number.isInteger(caseIndex) || caseIndex < this.nextExpectedIndex) {
      throw new Error(`Received invalid or already-emitted case index: ${caseIndex}`);
    }
    if (this.pendingByIndex.has(caseIndex)) {
      throw new Error(`Received duplicate completion for case index: ${caseIndex}`);
    }
    this.pendingByIndex.set(caseIndex, result);
    await this.drainContiguous();
  }

  /** Returns the next required index that has not yet been emitted. */
  getNextExpectedIndex(): number {
    return this.nextExpectedIndex;
  }

  /** Returns how many completed results are currently waiting for earlier indexes. */
  getPendingCount(): number {
    return this.pendingByIndex.size;
  }

  /** Emits buffered results while the next expected index is available in the stash. */
  private async drainContiguous(): Promise<void> {
    while (this.pendingByIndex.has(this.nextExpectedIndex)) {
      const expectedCaseIndex = this.nextExpectedIndex;
      const result = this.pendingByIndex.get(expectedCaseIndex) as TResult;
      await this.emit(expectedCaseIndex, result);
      this.pendingByIndex.delete(expectedCaseIndex);
      this.nextExpectedIndex += 1;
    }
  }
}
