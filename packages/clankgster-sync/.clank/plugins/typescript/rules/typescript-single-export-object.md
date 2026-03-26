# Single runtime export object

**Purpose:** Prefer one runtime export: a single object that holds all public API (functions, constants, types re-exported separately). Keeps common code easy to discover and avoids scattered named exports.

**When:** Use for shared utilities, helpers, and config modules under `scripts/` (e.g. `config-helpers.ts`, `path-helpers.ts`, `json-patch.ts`).

**Good:**

```ts
// One export: the object
export const pathHelpers = {
  rootDir: '',
  get scriptDir(): string { ... },
  joinRepo(repoRoot: string, ...segments: string[]): string { ... },
  normalizePathForCompare(p: string): string { ... },
};
```

**Bad:**

```ts
// Many named exports — callers must know the full surface
export const rootDir = ''

export function getScriptDir(): string { ... }
export function joinRepo(...): string { ... }
export function normalizePathForCompare(...): string { ... }
```

**Notes:**

- Types/interfaces can stay as separate `export type` / `export interface` or live on the object
- One object per module; keep the object slim (delegate to private functions if needed)
- Matches existing pattern in `config-helpers`, `json-patch`, `path-helpers`, `presetConstants`

**Inlining and self-reference:**

- Prefer **inlining** literals, functions, and simple values on the object (property values) instead of a separate module-level `const`/`let` that exists only to be assigned or spread into the object — keeps the public surface in one place
- When a method or getter needs **another key on the same object**, use `this` on methods, or **getters** / **method shorthand** so internal access goes through the object (e.g. `[...this.DEFAULT_EXCLUDE]` inside `getEffectiveWalkExclude`, not a free variable duplicating the list)
- Avoid referencing the export object by name from inside its own literal before initialization unless you rely on methods being invoked only after the object exists (prefer `this` for sibling properties on the same object)
