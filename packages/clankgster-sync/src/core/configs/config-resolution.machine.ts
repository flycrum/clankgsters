import { assign, fromPromise, setup } from 'xstate';
import {
  clankgsterConfigResolver,
  type ClankgsterConfigResolutionDetails,
} from './config-resolver.js';

export interface ConfigResolutionMachineInput {
  mode: 'sync' | 'clear';
  repoRoot: string;
}

export interface ConfigResolutionMachineContext {
  details: ClankgsterConfigResolutionDetails | null;
  errorMessage: string | null;
  input: ConfigResolutionMachineInput;
}

export type ConfigResolutionMachineEvent = { type: 'xstate.init' } | { type: 'retry' };

export const configResolutionMachine = setup({
  types: {
    context: {} as ConfigResolutionMachineContext,
    events: {} as ConfigResolutionMachineEvent,
    input: {} as ConfigResolutionMachineInput,
    output: {} as ClankgsterConfigResolutionDetails,
  },
  actors: {
    resolveConfig: fromPromise(async ({ input }: { input: ConfigResolutionMachineInput }) => {
      const result = await clankgsterConfigResolver.resolve(input);
      if (result.isErr()) throw result.error;
      return result.value;
    }),
  },
  guards: {
    hasDetails: ({ context }) => context.details != null,
  },
}).createMachine({
  id: 'configResolutionMachine',
  context: ({ input }) => ({
    details: null,
    errorMessage: null,
    input,
  }),
  initial: 'resolving',
  states: {
    resolving: {
      invoke: {
        src: 'resolveConfig',
        input: ({ context }) => context.input,
        onDone: {
          target: 'resolved',
          actions: assign({
            details: ({ event }) => event.output,
            errorMessage: () => null,
          }),
        },
        onError: {
          target: 'failed',
          actions: assign({
            errorMessage: ({ event }) => String(event.error),
          }),
        },
      },
    },
    resolved: {
      always: {
        guard: 'hasDetails',
        target: 'done',
      },
    },
    done: {
      type: 'final',
      output: ({ context }) => context.details as ClankgsterConfigResolutionDetails,
    },
    failed: {
      on: {
        retry: {
          target: 'resolving',
          actions: assign({
            errorMessage: () => null,
          }),
        },
      },
    },
  },
});
