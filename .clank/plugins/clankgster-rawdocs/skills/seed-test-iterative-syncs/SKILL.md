---
name: rawdocs-seed-test-iterative-syncs
description: >-
  Resets and seeds the iterative-sync test fixture plugin with the complex
  rawdocs bundle. Use this as a dedicated fixture lifecycle skill before running
  iterative sync loops.
disable-model-invocation: true
user-invocable: false
---

# rawdocs seed test iterative syncs

## Scope

This skill owns fixture lifecycle only. It must:

1. reset the target fixture path
2. scaffold plugin structure
3. seed `rawdocs/` from the complex bundle

It must not run continuity loops, scoring, or refinement patching.

## Pre-checks

Follow [`prechecks.md`](../../references/create-plugin-shared/prechecks.md).

## Fixed target path

Use this exact fixture path:

`.clank/plugins/_rawdocs-refine-test-iterative-syncs`

Treat this as `TARGET_PLUGIN_PATH`.

## Steps

1. If `TARGET_PLUGIN_PATH` exists, delete it without asking.
2. Create a plugin scaffold at `TARGET_PLUGIN_PATH` using:
   - [`step-2-scaffold.md`](../../references/create-plugin-shared/step-2-scaffold.md)
3. Seed `TARGET_PLUGIN_PATH/rawdocs/` from [`references/step-4-seed-rawdocs.md`](references/step-4-seed-rawdocs.md).
4. Return a summary with:
   - target path
   - seeded files list
   - verification outcome

## Verification

- [ ] `TARGET_PLUGIN_PATH` resolved to `.clank/plugins/_rawdocs-refine-test-iterative-syncs`
- [ ] Any prior fixture at that path was removed before scaffolding
- [ ] Bare plugin files created (`README.md`, `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`)
- [ ] `rawdocs/` created
- [ ] All `*.md` files from [`test-complex-rawdocs/`](../../references/test-complex-rawdocs/) exist under `TARGET_PLUGIN_PATH/rawdocs/`
- [ ] Summary includes handoff to [`rawdocs-test-iterative-syncs-loop`](../test-iterative-syncs-loop/SKILL.md)

