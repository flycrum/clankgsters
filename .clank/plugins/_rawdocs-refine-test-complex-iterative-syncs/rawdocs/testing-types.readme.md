# Testing types

## Purpose

Type tests ensure the library's typings (e.g. exported APIs, composables, component props) are correct at the call site. See [AGENTS.md](../AGENTS.md) for repo rules and [Vitest testing types](https://vitest.dev/guide/testing-types) for the test API.

## Rule: assert only on types from the API

Assert only on types that flow from **calling** the exported APIs: return types, `useComposable()` result, instance keys. Do **not** assert on standalone fixture types (e.g. a hand-written definition type) that are unrelated to the library's return types. Goal: verify that the library's typings come through when implementing.

## Where

- **Files:** Vitest type tests live in `*.test-d.ts` (e.g. under the package: `packages/<pkg>/src/<file>.test-d.ts`).
- **Run:** `pnpm test` from root or from the package; typecheck is included via `--typecheck`.

## Relation

- Backlink: [AGENTS.md](../AGENTS.md) (How to refactor code / Type tests).


## Note
Iter 3 minor addition.

- footnote iter 9
