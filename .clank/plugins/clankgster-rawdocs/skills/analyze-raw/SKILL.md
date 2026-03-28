---
name: rawdocs-analyze-raw
description: >-
  Analyzes only a target plugin's `rawdocs/` directory in isolation, including
  nested text-based files, then returns a detailed synthesis package covering
  themes, objectives, writing style, organization opportunities, and
  low-creativity porting guidance for downstream structured plugin output.
  Must not read outside `rawdocs/`.
disable-model-invocation: true
user-invocable: false
---

# rawdocs analyze raw

## Scope

Analyze only the target plugin's `rawdocs/` subtree.

This skill exists for ingestion analysis, not output writing.

## Absolute boundaries

- Read only files under provided `target_rawdocs_path`.
- Do not read or infer from any sibling plugin folders.
- Ignore non-text files (binary/images/archives).
- Return analysis package only.

## 1) Reference capo guidance

Read and note organizing lens from:

- [`clankgster-capo plugins-create-context/SKILL.md`](../../../clankgster-capo/skills/plugins-create-context/SKILL.md)
- [`clankgster-capo plugins-create-context/reference.md`](../../../clankgster-capo/skills/plugins-create-context/reference.md)

Use this guidance only as organization lens; do not rewrite rawdocs voice.

## 2) Read rawdocs recursively

1. Build recursive file list under `target_rawdocs_path`.
2. Read text-based files.
3. Skip non-text files and record skip list.

## 3) Extract themes and objectives

From rawdocs content, identify:

- domain themes
- intended outcomes
- operational priorities
- implied audience/use context
- implied audience/use context

## 4) Profile writing style

Capture stylistic signals, including:

- tone and cadence
- heading patterns
- code quote preferences (`'` vs `"`)
- punctuation habits
- directive style (imperative vs descriptive)
- repetition patterns that look intentional

## 5) Run supporting external pattern scan

Run focused web research on similar plugin patterns matching identified themes.

Return concise pattern digest used only to improve organization strategy, not to override source voice.

## 6) Analyze organization opportunities

Provide structured recommendations for:

- logical grouping
- candidate file boundaries
- candidate folder mapping to plugin content types
- section sequencing inside candidate files

Porting policy:

- creativity near zero, enforced by
  [../../references/rawdocs-low-variance-porting-contract.md](../../references/rawdocs-low-variance-porting-contract.md)
- preserve source wording unless correction is clearly needed
- grammar/spelling edits only when conservative and unambiguous

## 7) Return output package

Return an extensive package with:

1. Scope confirmation (`rawdocs`-only)
2. File inventory + skip list
3. Theme/objective model
4. Style profile
5. External pattern digest
6. Organization recommendations
7. Porting fidelity constraints and risks

## Verification

- [ ] No file outside `target_rawdocs_path` was read
- [ ] Non-text files were skipped and listed
- [ ] Style profile includes quote/header habits
- [ ] Recommendations preserve low-creativity constraints

## Cross-references

- [../../../clankgster-capo/skills/plugins-create-context/SKILL.md](../../../clankgster-capo/skills/plugins-create-context/SKILL.md)
- [../struct-sync/SKILL.md](../struct-sync/SKILL.md)
