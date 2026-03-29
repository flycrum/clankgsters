---
name: rawdocs-create-plugin
description: >-
  Creates a minimal rawdocs structured plugin scaffold at a user-provided path.
  Asks for the target plugin location, creates bare plugin manifests and
  README, creates `rawdocs/`, and writes `rawdocs/getting-started.md` from a
  built-in template. Use when starting a new plugin that will be maintained
  through the rawdocs workflow.
---

# rawdocs create plugin

## Scope

Create a barebones plugin that is ready for the `rawdocs/` workflow and future `/rawdocs-struct-sync` runs.

## Pre-checks

Follow [`prechecks.md`](../../references/create-plugin-shared/prechecks.md).

## Steps

### 1) Gather target path

Follow [`step-1-gather-path.md`](../../references/create-plugin-shared/step-1-gather-path.md).

### 2) Create barebones plugin scaffold

Follow [`step-2-scaffold.md`](../../references/create-plugin-shared/step-2-scaffold.md).

### 3) Create barebones `rawdocs/` directory

Follow [`step-3-rawdocs-dir.md`](../../references/create-plugin-shared/step-3-rawdocs-dir.md).

### 4) Create `rawdocs/getting-started.md` from template

Follow [`step-4-getting-started.md`](references/step-4-getting-started.md) (source template: [`references/seed/getting-started-template.md`](references/seed/getting-started-template.md)).

### 5) Return setup summary

Follow [`step-5-return-summary.md`](../../references/create-plugin-shared/step-5-return-summary.md).

## Verification

* [ ] Target plugin path was explicitly provided by the user
* [ ] Bare plugin files created (`README.md`, `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`)
* [ ] `rawdocs/` created
* [ ] `rawdocs/getting-started.md` created from the template
* [ ] Summary includes the next step to structural sync

