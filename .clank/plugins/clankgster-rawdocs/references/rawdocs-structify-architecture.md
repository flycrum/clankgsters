# rawdocs structural sync architecture

Detailed architecture for `rawdocs-struct-sync`, including isolation boundaries, data contracts, and continuity strategy.

## Goals

1. Let users write freely in plugin-local `rawdocs/`.
2. Convert that content into organized plugin context output.
3. Preserve writing style and intent with minimal creative rewriting.
4. Maintain continuity across repeated structural sync runs while allowing structure to evolve.
5. Keep `rawdocs/` untouched and unlinked.

## Input model

- Primary input is a user-provided path for either:
  - the target plugin root, or
  - the plugin's `rawdocs/` directory.
- Runtime normalizes to two derived paths:
  - `target_plugin_path`
  - `target_rawdocs_path` (`target_plugin_path/rawdocs`)

## Isolation model

Run two analysis workflows in separate sub-agents to avoid context bleed:

1. `rawdocs-analyze-raw`
   - Reads only `rawdocs/` recursively.
   - Produces source-truth analysis package.
2. `rawdocs-analyze-existing`
   - Reads all plugin content recursively except `rawdocs/`.
   - Produces continuity and structure analysis package.

## Non-overlap contract

- `rawdocs-analyze-raw` must not inspect files outside `rawdocs/`.
- `rawdocs-analyze-existing` must explicitly exclude `rawdocs/`.
- Combined outputs should cover the complete plugin state with zero overlap.

## Output contracts

### `rawdocs-analyze-raw` output package

- Resolved rawdocs file inventory
- Text-file eligibility map and skipped non-text files list
- Theme/objective map
- Style and tone profile (headers, punctuation habits, quote preferences, cadence)
- Content clustering candidates
- Porting fidelity constraints (temperature-near-zero guidance)
- Capo-linked structure lens notes
- External pattern research digest

### `rawdocs-analyze-existing` output package

- Plugin sitemap excluding `rawdocs/`
- Empty/near-empty determination
- If non-empty: per-file purpose and section-outline summary (high-level only)
- Existing style conventions profile
- Continuity anchors and potential evolution points

## Planning model

`rawdocs-struct-sync` synthesizes both analysis outputs into:

1. Draft migration/update plan
2. Refinement pass plan
3. Final file operation plan

Plan priorities:

1. Preserve author meaning and style from rawdocs
2. Respect continuity from existing structure
3. Evolve structure only when justified for scaling
4. Never alter `rawdocs/`

## Write model

1. Snapshot final plan.
2. Remove all plugin files and folders except `rawdocs/`.
3. Rebuild output folders/files from refined plan.
4. Validate:
   - no markdown links to `rawdocs/`
   - expected folder shape present
   - cross-links resolve
   - style profile alignment is documented

## Risk controls

- **Boundary risk:** accidental `rawdocs/` mutation or deletion
  - Mitigation: explicit keep-list and deletion guard.
- **Overlap risk:** both analyzers inspect same files
  - Mitigation: path filters and post-run coverage check.
- **Over-editing risk:** rewriting user voice
  - Mitigation: style profile + low-creativity constraints.
- **Continuity risk:** structure thrash between structural syncs
  - Mitigation: continuity anchors and staged restructuring criteria.

## Cross-references

- [`rawdocs-struct-sync`](../skills/struct-sync/SKILL.md)
- [`rawdocs-analyze-raw`](../skills/analyze-raw/SKILL.md)
- [`rawdocs-analyze-existing`](../skills/analyze-existing/SKILL.md)
- [`rawdocs-internal-linking`](../rules/rawdocs-internal-linking.md)
- [`clankgster-capo plugins-create-context`](../../clankgster-capo/skills/plugins-create-context/SKILL.md)
