# rawdocs first-pass integrated plan spec

This reference defines the detailed operating method for step 5 in `rawdocs-struct-sync`.

## Why this exists

Step 5 is the architectural center of the structural sync workflow. It must merge two intentionally isolated analyses into one actionable plan while preserving:

- rawdocs source meaning and style
- continuity from existing plugin structure
- scalability as content volume and complexity increase
- strict `rawdocs/` preservation and non-linking boundaries

## Inputs required from prior steps

You must have completed and validated both analyzer outputs:

1. `rawdocs-analyze-raw` output package
2. `rawdocs-analyze-existing` output package

You must also carry normalized path variables from step 1:

- `target_plugin_path`
- `target_rawdocs_path`

## Non-negotiable constraints

Before planning, restate and lock these constraints explicitly:

1. `rawdocs/` remains unmodified.
2. Authored plugin files must not link to `rawdocs/`.
3. Rawdocs meaning and voice are source truth for content mapping.
4. Existing plugin structure is continuity guidance, not immutable law.
5. Creativity is near zero during content porting (no voice rewriting), enforced by
   [`rawdocs-low-variance-porting-contract.md`](../../../references/rawdocs-low-variance-porting-contract.md).

## Step 5.1: Build the source-truth matrix (from rawdocs analysis)

Construct a source-truth matrix with one row per conceptual unit extracted from rawdocs.

For each row capture:

- `concept_id`
- `theme`
- `objective`
- `source_files`
- `source_section_markers`
- `intent_priority` (high/medium/low)
- `style_signals` (tone, heading pattern, quote preference, pacing)
- `fidelity_notes` (phrasing to preserve, terms not to rename, words that look intentional)

This matrix is the primary content authority.

## Step 5.2: Build the continuity matrix (from existing analysis)

Construct a continuity matrix representing non-rawdocs current plugin output.

For each existing file capture:

- `existing_path`
- `current_role` (rule/skill/reference/doc/etc)
- `purpose_summary`
- `section_outline`
- `style_signature`
- `stability_rating` (stable/evolving/fragile)
- `continuity_anchor_level` (strong/medium/weak)
- `known_debt_or_growth_pressure`

This matrix is the continuity authority.

## Step 5.3: Generate architecture candidates

Draft at least three architecture candidates for the next output shape:

- **Candidate A: conservative continuity**
  - maximize retention of existing structure
  - smaller targeted additions/edits
- **Candidate B: balanced continuity + scale**
  - preserve anchors but split/merge where evidence supports it
- **Candidate C: aggressive restructuring**
  - optimized for future scale with higher short-term churn

Every candidate must include:

- target output tree (excluding `rawdocs/`)
- file purpose map
- section-outline map per proposed file
- migration map (`old -> new`, `old -> removed`, `new -> added`)
- rationale tied to both matrices

## Step 5.4: Score candidates using weighted criteria

Score each candidate using the rubric below (0-5 per criterion):

1. **Source fidelity (weight 5)**  
   Does the candidate preserve rawdocs meaning/voice with minimal reinterpretation?
2. **Continuity (weight 4)**  
   Does it maintain recognizable structure and style from existing plugin outputs?
3. **Scalability (weight 4)**  
   Will it handle growth in rawdocs volume/topics over repeated structural syncs?
4. **Operational churn (weight 3, inverse)**  
   Lower churn scores better. Penalize unnecessary mass renames/moves.
5. **Clarity and maintainability (weight 3)**  
   Are file boundaries and section scopes coherent and durable?
6. **Boundary compliance (weight 5, hard gate)**  
   Any candidate that violates `rawdocs/` rules is invalid regardless of score.

Select highest valid total score. If tie: prefer lower operational churn.

## Step 5.5: Produce the first-pass migration package

The first-pass output must be machine-actionable and human-reviewable.

### Required output sections

1. **Locked constraints**
   - explicit hard boundaries and style fidelity commitments
2. **Selected candidate + score table**
   - include why non-selected candidates were rejected
3. **Target output tree**
   - full directory/file map excluding `rawdocs/`
4. **File-by-file purpose and content allocation map**
   - each file's role and which source-truth concepts it receives
5. **Section-level outline plan**
   - headings/subheadings or equivalent structure by file
6. **Migration actions**
   - `retain`, `update`, `split`, `merge`, `rename`, `create`, `remove`
7. **Deletion safety map**
   - explicit keep-list with `rawdocs/` and descendants protected
8. **Risk register**
   - style drift risk, continuity break risk, taxonomy drift risk
9. **Assumptions + open decisions**
   - issues to be resolved in step 6 refinement

## Step 5.6: Guard against over-interpretation

Before finalizing first-pass output, run this checklist:

- Are we preserving original phrasing where practical?
- Did we avoid introducing new conceptual claims not present in rawdocs?
- Are we minimizing "helpful rewrites" that change voice?
- Did we avoid normalizing away intentional quirks in style?
- Did we avoid copy-heavy extraction from existing non-rawdocs files?

If any answer is no, revise before handoff to step 6.

## Step 5.7: Hand off to refinement step

At step 5 completion, handoff package to step 6 must include:

- selected candidate details
- full migration package
- ranked list of structural change justifications
- unresolved decisions queue

Step 6 uses this handoff to decide what evolves now versus later.

## Example output skeleton

Use this exact skeleton shape (fill with run-specific content):

1. Locked constraints
2. Candidate score table
3. Selected architecture summary
4. Target output tree
5. File purpose + concept allocation map
6. Section outline map
7. Migration action ledger
8. Deletion safety map
9. Risks and mitigations
10. Assumptions and open decisions

## Cross-references

- [../SKILL.md](../SKILL.md)
- [../../../../clankgster-capo/skills/plugins-create-context/SKILL.md](../../../../clankgster-capo/skills/plugins-create-context/SKILL.md)
- [../../../../clankgster-capo/skills/plugins-create-context/reference.md](../../../../clankgster-capo/skills/plugins-create-context/reference.md)
- [../../../rules/rawdocs-internal-linking.md](../../../rules/rawdocs-internal-linking.md)
