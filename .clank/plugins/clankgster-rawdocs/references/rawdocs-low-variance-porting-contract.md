# rawdocs low-variance porting contract

Shared contract for any workflow step that maps `rawdocs/` content into structured plugin output.

Use this contract when a skill/reference says "creativity near zero" or "low-creativity porting."

## Purpose

Convert content without rewriting author voice, introducing new meaning, or drifting style.

## Hard, testable rules

1. **No new concepts rule**
   - Do not introduce claims, policies, or directives that are not inferable from source material.
   - PASS if every major claim in output maps to source evidence.
   - FAIL if any major claim lacks source mapping.

2. **Phrase preservation rule**
   - Preserve source phrasing for key terms, labels, and repeated constructs unless correctness demands change.
   - PASS if changed key terms are justified in a change log.
   - FAIL if terminology is replaced without explicit rationale.

3. **Voice preservation rule**
   - Preserve tone, section cadence, and heading style patterns.
   - PASS if style profile alignment section is present and non-empty.
   - FAIL if output style differs materially with no justification.

4. **Edit minimization rule**
   - Apply only conservative spelling/grammar fixes and structural relocation.
   - PASS if rewrite ratio is low and edits are classified.
   - FAIL if broad paraphrasing occurs without necessity.

5. **Boundary compliance rule**
   - Never modify `rawdocs/` files and never emit markdown links to `rawdocs/`.
   - PASS if rawdocs-preservation check and link-scan check both pass.
   - FAIL if either check fails.

6. **Traceability rule**
   - Every output file section must map back to one or more source units.
   - PASS if traceability map exists for all output files.
   - FAIL if any output section is untraceable.

## Required run artifacts

Any step that applies this contract must produce:

1. **Source-to-output traceability map**
   - source unit -> output file -> output section
2. **Terminology change log**
   - old term -> new term -> reason (if none, state "none")
3. **Style alignment notes**
   - heading style, quote preference, tone/cadence checks
4. **Boundary check results**
   - rawdocs untouched check
   - no-link-to-rawdocs check
5. **Rule verdict table**
   - one row per rule with PASS/FAIL and evidence note

## Stop conditions

Do not proceed to final write if any rule fails.

If any rule fails:

1. revise the plan/output candidate
2. rerun verdict table
3. proceed only when all rules pass

## Minimum verdict table schema

Use this schema exactly:

- `rule_id`
- `rule_name`
- `verdict` (`PASS` | `FAIL`)
- `evidence`
- `remediation` (required when `FAIL`)

