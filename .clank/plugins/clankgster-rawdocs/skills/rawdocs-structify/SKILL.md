---
name: rawdocs-structify
description: >-
  Runs a full rawdocs-to-plugin synchronization workflow for a user-selected
  target plugin. Collects explicit path input, launches two isolated
  sub-agent analyses with strict non-overlapping scopes (rawdocs-only and
  plugin-except-rawdocs), combines outputs into a strategic and refined plan,
  then rebuilds plugin content while preserving rawdocs untouched and
  preserving source writing style as closely as possible.
---

# rawdocs structify

## Scope

Execute the complete `rawdocs/` structify sync lifecycle for one target plugin path:

1. Ask for target path.
2. Run isolated analysis sub-agents.
3. Build + refine final structify sync plan.
4. Remove stale plugin content (excluding `rawdocs/`).
5. Reconcile structured plugin output (upsert/update).

This skill is orchestration-first and intentionally verbose in execution records.

## Hard boundaries

- `rawdocs/` is mandatory ingestion input and must remain unmodified.
- `rawdocs/` must never be linked by authored plugin markdown files.
- Analysis scopes must not overlap:
  - `rawdocs-analyze-raw` -> only `rawdocs/`
  - `rawdocs-analyze-existing` -> everything except `rawdocs/`

## Pre-checks

**STOP** if the user has not provided or confirmed a target path through the explicit input step.

**STOP** if `target_plugin_path/rawdocs/` does not exist after normalization. Ask the user to create it first.

**STOP** if deletion safeguards are not in place before cleanup (must keep `rawdocs/` intact).

## 1) Gather and normalize target input

1. Use AskUserQuestion first, following [`rawdocs-target-input.md`](references/rawdocs-target-input.md).
2. Accept either:
   - plugin root path, or
   - `rawdocs/` path.
3. Normalize and store:
   - `target_plugin_path`
   - `target_rawdocs_path`
4. Echo both resolved paths in working notes for deterministic reuse in later steps.

## 2) Launch isolated rawdocs analysis sub-agent

Run `rawdocs-analyze-raw` in a dedicated sub-agent with an explicit prompt that includes:

- normalized `target_rawdocs_path`
- explicit ban on reading outside `rawdocs/`
- requirement to reference capo writing guidance:
  - [`clankgster-capo plugins-write-context/SKILL.md`](../../../clankgster-capo/skills/plugins-write-context/SKILL.md)
  - [`clankgster-capo plugins-write-context/reference.md`](../../../clankgster-capo/skills/plugins-write-context/reference.md)

Require output package to include:

- file inventory and text eligibility
- themes/objectives
- style/tone profile
- external pattern research summary
- organization recommendations with low-creativity porting constraints enforced by
  [`rawdocs-low-variance-porting-contract.md`](../../references/rawdocs-low-variance-porting-contract.md)

## 3) Launch isolated existing-plugin analysis sub-agent (parallel)

Run `rawdocs-analyze-existing` in a separate sub-agent with:

- normalized `target_plugin_path`
- explicit exclusion of `target_rawdocs_path`
- explicit return shape for continuity analysis

Require output package to include:

- sitemap excluding `rawdocs/`
- empty/near-empty classification
- high-level file purposes and section-outline summaries (not dense textual excerpts)
- style/tone profile and continuity anchors

## 4) Wait and reconcile both outputs

Wait for both sub-agent outputs and validate:

- rawdocs analyzer did not inspect non-rawdocs paths
- existing analyzer excluded rawdocs paths
- combined coverage is complete with no overlap

If overlap or omission is detected, rerun the affected analyzer with tighter scope instructions.

## 5) Build first-pass integrated plan

Use both analysis outputs to create a first-pass plan following
[`rawdocs-first-pass-integrated-plan-spec.md`](references/rawdocs-first-pass-integrated-plan-spec.md).

Required planning order:

1. Lock source constraints from `rawdocs-analyze-raw` (meaning, style, and fidelity constraints).
2. Lock continuity constraints from `rawdocs-analyze-existing` (structure continuity anchors and style continuity anchors).
3. Draft architecture candidates for target plugin output (outside `rawdocs/` only).
4. Score and select the best candidate using continuity, scalability, and minimal-churn criteria.
5. Emit a concrete migration package that can be executed deterministically.

Minimum first-pass output sections:

- source-truth constraints (rawdocs meaning + style)
- continuity constraints (existing plugin non-rawdocs patterns)
- proposed output tree (folders/files outside `rawdocs/`)
- file-by-file purpose map
- section-level outline map per file
- migration map (`old -> new`, `old -> removed`, `new -> added`)
- retention/deletion list (explicitly excluding `rawdocs/`)
- unresolved decisions and assumptions queue

Hard rules during step 5:

- keep `rawdocs/` untouched
- no markdown links into `rawdocs/`
- creativity near zero when mapping rawdocs content into structured files
- preserve quote/header/tone habits unless change is explicitly justified

## 6) Build second-pass refinement plan

Run a refinement pass focused on:

- continuity across repeated structify sync runs
- minimizing churn in stable structure
- evolving structure only where growth demands it
- preserving section styles, tone, quote preferences, and formatting habits

Document why each structural change is or is not applied.

## 7) Remove stale target content (never blanket-wipe)

Using the refined plan and migration map, identify only stale artifacts under `target_plugin_path` (outside `rawdocs/`) and remove those stale items only.

Required stale classification before deletion:

- stale = file/folder not present in target output tree, or explicitly marked `remove`/`rename-source` in migration actions
- retain = file/folder in keep-list, planned target output tree, or marked `retain`/`update`/`split`/`merge`
- uncertain = ambiguous ownership; do not delete automatically, add to run report for user review

Apply explicit deletion guards:

- deny deletion path patterns that include `/rawdocs`
- dry-list removal candidates before execution
- verify `rawdocs/` still exists immediately after deletion

## 8) Write reconciled plugin output (no full rebuild)

Create/update only files/folders required by the refined plan and migration actions. Do not delete files in this step.

Authoring constraints:

- preserve rawdocs intent and style
- keep creativity minimal
- apply only conservative spelling/grammar fixes
- avoid links to `rawdocs/`

## 9) Validate and report

Validate:

- `rawdocs/` untouched and present
- no links to `rawdocs/` from authored files
- output tree matches refined plan
- cross-links resolve
- style profile alignment recorded
- stale deletion ledger is present (deleted + retained + uncertain)

Return a structify sync report with:

- resolved target paths
- analyzer scope verification
- plan + refinement summary
- write summary
- validation checklist outcome

## Verification

- [ ] User target path was explicitly provided and normalized
- [ ] `rawdocs-analyze-raw` read only `rawdocs/`
- [ ] `rawdocs-analyze-existing` excluded `rawdocs/`
- [ ] Combined analyzer coverage had no overlap and no omissions
- [ ] Stale-only cleanup executed with explicit classification and guard checks
- [ ] `rawdocs/` was preserved through cleanup
- [ ] No markdown links target `rawdocs/`
- [ ] Final output reflects refined plan and continuity strategy

## Cross-references

- [references/rawdocs-execution-notes.md](references/rawdocs-execution-notes.md)
- [references/rawdocs-target-input.md](references/rawdocs-target-input.md)
- [references/rawdocs-first-pass-integrated-plan-spec.md](references/rawdocs-first-pass-integrated-plan-spec.md)
- [../../references/rawdocs-structify-architecture.md](../../references/rawdocs-structify-architecture.md)
- [../../rules/rawdocs-internal-linking.md](../../rules/rawdocs-internal-linking.md)
