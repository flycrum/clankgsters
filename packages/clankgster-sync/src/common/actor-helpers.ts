import type { AnyActorRef } from 'xstate';

type SnapshotLike = {
  status: string;
  output?: unknown;
  context?: unknown;
};

function outputOrContext(snapshot: SnapshotLike): unknown {
  return snapshot.output ?? snapshot.context;
}

/** Coerces actor error/stop payloads to an Error for promise rejection */
function asRejectedError(payload: unknown, fallbackMessage: string): Error {
  if (payload instanceof Error) return payload;
  if (typeof payload === 'string' && payload.length > 0) return new Error(payload);
  if (payload != null && typeof payload === 'object') {
    const msg =
      typeof (payload as { message?: unknown }).message === 'string'
        ? (payload as { message: string }).message
        : typeof (payload as { errorMessage?: unknown }).errorMessage === 'string'
          ? (payload as { errorMessage: string }).errorMessage
          : undefined;
    if (msg != null && msg.length > 0) return new Error(msg);
    try {
      return new Error(JSON.stringify(payload));
    } catch {
      return new Error(fallbackMessage);
    }
  }
  if (payload == null) return new Error(fallbackMessage);
  if (typeof payload === 'number' || typeof payload === 'boolean' || typeof payload === 'bigint') {
    return new Error(String(payload));
  }
  if (typeof payload === 'symbol') return new Error(payload.description ?? String(payload));
  return new Error(fallbackMessage);
}

/** Helpers for XState machine actors: await terminal output from snapshot `output`, or `context` when needed. */
export const actorHelpers = {
  /** Subscribes until the actor reaches a terminal status (`done` resolves; `error` / `stopped` reject). */
  awaitOutput<TOutput>(actor: AnyActorRef): Promise<TOutput> {
    return new Promise<TOutput>((resolve, reject) => {
      let subscription: { unsubscribe(): void } | undefined;
      const finish = (action: () => void): void => {
        subscription?.unsubscribe();
        action();
      };

      const onSnapshot = (snapshot: ReturnType<AnyActorRef['getSnapshot']>): boolean => {
        const s = snapshot as SnapshotLike;
        if (s.status === 'done') {
          finish(() => resolve(outputOrContext(s) as TOutput));
          return true;
        }
        if (s.status === 'error') {
          finish(() =>
            reject(asRejectedError(outputOrContext(s), 'Actor ended with error status'))
          );
          return true;
        }
        if (s.status === 'stopped') {
          finish(() =>
            reject(
              asRejectedError(outputOrContext(s), 'Actor stopped before reaching a final output')
            )
          );
          return true;
        }
        return false;
      };

      if (onSnapshot(actor.getSnapshot())) return;

      subscription = actor.subscribe({
        error: (error) => {
          finish(() => reject(error));
        },
        next: (snapshot) => {
          onSnapshot(snapshot);
        },
      });
    });
  },
};
