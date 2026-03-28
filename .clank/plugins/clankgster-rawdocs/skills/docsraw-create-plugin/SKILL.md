---
name: docsraw-create-plugin
description: >-
  Creates a minimal rawdocs structured plugin scaffold at a user-provided path.
  Asks for the target plugin location, creates bare plugin manifests and
  README, creates `rawdocs/`, and writes `rawdocs/getting-started.md` from a
  built-in template. Use when starting a new plugin that will be maintained
  through the rawdocs workflow.
---

# docsraw create plugin

## Scope

Create a barebones plugin that is ready for the `rawdocs/` workflow and future `/docsraw-sync-run` runs.

## Pre-checks

**STOP** if user does not provide a target plugin path.

**STOP** if target path exists and user does not explicitly allow writing/overwriting.

## 1) Gather target path

Ask the user for the plugin root path to create.

Example accepted shape: `.clank/plugins/my-plugin`

Store as `target_plugin_path`.

## 2) Create barebones plugin scaffold

Create:

- `target_plugin_path/README.md`
- `target_plugin_path/.claude-plugin/plugin.json`
- `target_plugin_path/.cursor-plugin/plugin.json`

Manifest basics:

- name: plugin directory name
- version: `0.1.0`
- description: short one-line summary of the plugin's rawdocs workflow intent

README basics:

- plugin purpose
- rawdocs first workflow note
- reminder to run `/docsraw-sync-run` for structured output generation

## 3) Create barebones rawdocs directory

Create:

- `target_plugin_path/rawdocs/`

This directory is the opt-in signal for rawdocs mode.

## 4) Create `rawdocs/getting-started.md` from template

Use [`getting-started-template.md`](references/getting-started-template.md) as source and write:

- `target_plugin_path/rawdocs/getting-started.md`

Keep the template shape and tone, but replace placeholders for plugin name/path if needed.

## 5) Return setup summary

Return:

- resolved `target_plugin_path`
- created files/folders
- 🍓 Success! Field note from your friendly doc-bot: want me to run your first `/docsraw-sync-run` so we can observe what it does and which artifacts it produces?

## Verification

- [ ] Target plugin path was explicitly provided by user
- [ ] Bare plugin files created (`README.md`, `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`)
- [ ] `rawdocs/` created
- [ ] `rawdocs/getting-started.md` created from template
- [ ] Summary includes next step to sync

## Cross-references

- [references/getting-started-template.md](references/getting-started-template.md)
- [../docsraw-sync-run/SKILL.md](../docsraw-sync-run/SKILL.md)
- [../../rules/rawdocs-opt-in-placement.md](../../rules/rawdocs-opt-in-placement.md)
