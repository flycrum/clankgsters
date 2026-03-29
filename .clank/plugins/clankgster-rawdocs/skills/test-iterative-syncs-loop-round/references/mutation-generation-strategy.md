# Mutation generation strategy

Generate one mutation profile per iteration using [`mutation-taxonomy.md`](mutation-taxonomy.md).

## Inputs

- iteration index
- previous iteration outcomes
- trend state (continuity, subtractive honesty, bucket fit)
- remaining iteration budget

## Step 1: choose intensity band

Choose one:

- `no-op`
- `minor`
- `medium`
- `major`

Biasing rule:

- If last iteration had `high` churn and multiple `fail` goals, prefer `minor` or `no-op` next.
- If last two iterations are stable (`none` or `low`) with mostly `pass`, allow `medium` or `major` exploratory changes.

## Step 2: choose profile dimensions

Pick:

- one `file-qualifier`
- one `file-modifier-qualifier`
- one or more `file-modifiers`
- zero or more `fs-modifiers`

Logical fit rules:

- `no-op` -> no content or fs changes.
- `minor` -> usually `one-file` or `few-files`, `few`, and no more than one fs-modifier.
- `medium` -> usually `several-files`, `moderate`, optional fs-modifier.
- `major` -> usually `most-files` or `all-files`, `many`, and one to three fs-modifiers.

## Step 3: generate concrete mutation plan

Produce a concrete plan that includes:

1. target file set under `rawdocs/`
2. explicit operations per file
3. expected qualitative impact
4. rollback notes (if mutation creates invalid markdown or broken structure)

## Step 4: enforce realism and safety

Before applying:

- ensure mutations still reflect plausible developer documentation evolution
- ensure final rawdocs tree remains parseable markdown
- avoid contradictory operations on the same path

## Step 5: avoid repetitive patterns

Track recent profiles and avoid repeating the same pattern in consecutive iterations unless intentionally testing repeatability.

## Example profile format

```md
iteration: 4
intensity: medium
file_qualifier: several-files
file_modifier_qualifier: moderate
file_modifiers: additions+edits
fs_modifiers: create-file
targets:
  - rawdocs/testing-types.readme.md
  - rawdocs/turborepo-general.readme.md
  - rawdocs/new-topic.readme.md
```
