---
name: auditing-content-quality
description: >-
  Audits plugin content for prompt engineering quality — clarity, concision,
  positive framing, calibrated emphasis, good/bad examples, and non-inferable
  signal. Reads every file in a target plugin, evaluates six quality dimensions,
  assigns a letter grade (F through A+) with characterization and ASCII art,
  and produces a findings table with suggestions. Triggers — "audit content
  quality", "review plugin writing", "check prompt quality", "grade my plugin",
  "are my rules well-written?", content quality review, plugin prose audit.
---

# Audit content quality

Review how plugin content is written — prompt engineering quality, clarity, concision, positive framing, appropriate emphasis, examples. Produces a letter grade with findings.

## Scope

Audits all `.md` files within a single plugin directory under `.clank/plugins/<plugin>/`. Evaluates six quality dimensions per file, produces a findings table, assigns an overall letter grade, and optionally saves a report. Does not modify content files — report only.

## Out of scope

- Plugin structure or naming (use auditing-plugin-structure)
- Link validity (use auditing-internal-links / auditing-external-links)
- Factual accuracy of claims (use auditing-fact-check)
- Fixing issues — this skill reports, the user decides what to fix

---

## Pre-checks

**STOP** if no plugin path is provided and the user does not specify one when asked. Use AskUserQuestion to request the plugin path.

**STOP** if the target directory does not exist. Tell the user the path is invalid.

---

## 1. Identify target files

Use Glob to find all `.md` files in the plugin directory:

```
<plugin-path>/**/*.md
```

Exclude `node_modules/` and `.git/` if present.

---

## 2. Read all content files

Use Read to load each `.md` file. For files over 500 lines, read in chunks.

---

## 3. Evaluate each file

<instructions>
For each file, assess these six quality dimensions. Rate each dimension using a
**tier label** — LLMs are more reliable at categorical assessment than numeric scoring.

### Tier labels

| Tier | Meaning |
| ------ | ------ |
| **Exemplary** | Best-in-class; could be used as a teaching example |
| **Strong** | Meets all conventions with minor polish opportunities |
| **Adequate** | Functional but has clear improvement areas |
| **Weak** | Multiple issues that degrade agent performance |
| **Poor** | Fundamentally undermines agent effectiveness |
| **N/A** | Dimension does not apply to this file type |

### Dimension 1: Clarity and concision

- Vague instructions ("make it good", "handle appropriately") without concrete guidance
- Filler words and hedging ("Note that...", "It should be noted...", "Please ensure...")
- Redundant phrasing or restating the same point multiple ways
- Grammar issues that impede agent parsing
- Audience: written for AI agents, not humans (condensed, imperative mood)

### Dimension 2: Framing

- Negative-only instructions ("Don't do X") without positive alternative ("Do Y instead")
- "Never" / "Do not" without reasoning or positive reframe
- Positive framing used consistently

### Dimension 3: Emphasis calibration

- ALL CAPS paragraphs or sentences (should be bold or `**STOP**` for hard breaks only)
- Overuse of "CRITICAL", "IMPORTANT", "MUST", "ALWAYS" — check if frequency dilutes impact
- Emphasis on inferable or obvious content (wastes emphasis budget)
- Calibrated for Claude 4.6 (no aggressive emphasis that overtriggers)

### Dimension 4: Examples

- Missing good/bad example pairs for non-trivial conventions
- Examples that are too long (over 10 lines for a single example)
- Examples that don't clearly illustrate the difference
- XML tags used for example structure (`<examples>`, `<example type="good">`)

### Dimension 5: Inferable content

- Standard practices the model already knows from training
- Restating tool documentation the agent has access to
- Generic advice that doesn't change agent behavior
- Every paragraph earns its tokens

### Dimension 6: Description fields (SKILL.md only)

- Third person voice
- Trigger phrases included
- 150-700 characters (sweet spot)
- No XML tags or markdown formatting
- Front-loads distinctive terms
- Rate N/A for non-SKILL.md files

### Per-file output

After evaluating each file, record a per-file assessment:

```markdown
### <filename>

| Dimension | Tier | Notes |
| ------ | ------ | ------ |
| Clarity and concision | Strong | Concise, imperative mood, one filler phrase on line 42 |
| Framing | Exemplary | All instructions positive, alternatives provided |
| Emphasis calibration | Adequate | Two "CRITICAL" usages, one justified, one could be dialed back |
| Examples | Weak | No good/bad pairs for the main convention |
| Inferable content | Strong | Only one paragraph of obvious advice (line 88) |
| Description fields | N/A | Not a SKILL.md file |
```

</instructions>

---

## 4. Produce findings table

Output a consolidated findings table for issues only (Adequate or worse):

```markdown
## Content quality audit: <plugin-name>

**Files scanned:** N
**Issues found:** N (H high / M medium / L low)

| File | Issue | Severity | Suggestion |
| ------ | ------ | ------ | ------ |
| rules/plugin-topic.md | Negative framing: "Don't use X" without alternative | High | Reframe: "Use Y — X causes Z" |
| skills/doing-x/SKILL.md | Description is 80 chars, under minimum | Medium | Expand to 150-700 chars with trigger phrases |
| ... | ... | ... | ... |
```

Severity mapping from tiers:

- **High** — any dimension rated **Poor** (actively degrades agent performance)
- **Medium** — any dimension rated **Weak** (misses opportunity, wastes tokens)
- **Low** — any dimension rated **Adequate** with specific improvement noted

Group findings by severity (high first). If a file has no issues (all Strong or Exemplary), omit it from the table but count it in "Files scanned."

---

## 5. Grade assignment

<instructions>
Derive the overall grade from the distribution of tier ratings across ALL files and dimensions.

### Grade calculation

1. Collect all tier ratings across all files and applicable dimensions
2. Calculate the distribution: what percentage of ratings fall into each tier
3. Assign the grade using this rubric:

| Grade | Criteria |
| ------ | ------ |
| **A+** | ≥90% Exemplary, 0% Weak or Poor |
| **A** | ≥70% Exemplary, remainder Strong, 0% Poor |
| **A-** | ≥50% Exemplary, ≤10% Adequate, 0% Poor |
| **B+** | ≥60% Strong or better, ≤5% Weak, 0% Poor |
| **B** | ≥50% Strong or better, ≤10% Weak, 0% Poor |
| **B-** | ≥40% Strong or better, ≤15% Weak, 0% Poor |
| **C+** | ≥30% Strong or better, ≤20% Weak, ≤5% Poor |
| **C** | Majority Adequate or better, ≤25% Weak |
| **C-** | Majority Adequate or better, but >25% Weak |
| **D+** | Majority Adequate, significant Weak presence |
| **D** | Majority Weak, some Adequate |
| **F** | Majority Poor, or >50% Weak with Poor present |

### Grade characterization and badge

After determining the grade, output the matching characterization and an ASCII art badge.

#### Creative variation

The examples below are **base templates**, not fixed output. Each audit run should produce a unique variation of the badge for the assigned grade. Keep the character/object recognizable and the `GRADE: X` line intact, but vary the art freely:

- **Accessories** — add a hat, glasses, scarf, bowtie, crown, headphones, antenna, monocle, shield, wrench, coffee mug, diploma, etc.
- **Expressions** — swap eyes (`o o`, `^ ^`, `> <`, `- -`, `O o`, `@ @`, `* *`), change mouth shape, add eyebrows, blush marks
- **Poses and props** — arms up, waving, holding a sign, sitting, leaning, juggling, pointing
- **Scene dressing** — a small platform, stars, sparkles, thought bubble, tiny desk, podium
- **Scale** — stretch or compress slightly; add a line or remove one to shift proportions

Constraints: keep it under 10 lines of art (excluding the GRADE line), use only ASCII characters, and ensure the character/object stays clearly related to the grade's theme (e.g., F is still a primate, A+ is still a robot). The characterization text (name and description lines) stays fixed — only the art varies.

**F — Baboon**
The content appears to have been composed by enthusiastic primates
banging on keyboards. Impressive effort; zero signal.

```md
    .---.
   / o o \
  (   >   )
   \ --- /
    |   |
   _|   |_
  (_______)
  GRADE: F
```

**D — Parrot**
Lots of words repeated back with confidence.
Unfortunately, none of them help the agent do its job.

```md
     __
    /  \  ~~
   | oo |/
   |  > |
    \__/
    /||\
   / || \
  GRADE: D
```

**D+ — Scribe**
Somebody tried to document things.
The spirit is willing; the prompt engineering is weak.

```md
    _____
   |     |
   | ~~~ |
   | ~~~ |
   | ~~~ |
   |_____|
    _/ \_
  GRADE: D+
```

**C — Neanderthal**
The being that wrote this deserves a near-human grade.
Functional enough to survive, but not to thrive.

```md
     ___
    /. .\
   | \_/ |
    \ _ /
   --|+|--
    /| |\
   / | | \
  GRADE: C
```

**C+ — Homosapien**
Clearly written by a modern human with good intentions.
Needs the AI touch to reach its potential.

```md
     O
    /|\
    / \
   |   |
   THINK
   HARDER
  GRADE: C+
```

**B — Intern**
Solid fundamentals, follows the template, asks the right questions.
A few more review cycles and this ships.

```md
     O
    -|-
    / \
   [   ]
   NICE
   WORK!
  GRADE: B
```

**B+ — Engineer**
Clean, intentional, well-structured.
An experienced hand wrote this. Minor polish remains.

```
    _____
   |  _  |
   | |_| |
   |  _  |
   | | | |
   |_| |_|
   GRADE: B+
```

**A — AI-Augmented**
Look at the difference a good LLM, solid prompts,
and thoughtful context engineering makes.

```md
    /---\
   | o o |
   | ___ |
   |/   \|
    \   /
    |   |
    BRAIN
   GRADE: A
```

**A- — falls between B+ and A, use the A art with "GRADE: A-"**

**A+ — Clankgster**
Peak context engineering. This plugin could audit itself
and find nothing wrong. The robot approves.

```md
    [===]
   /|o o|\
  | |___| |
  | |   | |
   \|   |/
    |___|
    /   \
   PERFECT
  GRADE: A+
```

</instructions>

---

## 6. Summary

After the grade, provide:

1. **Tier distribution** — table showing count and percentage per tier across all assessments
2. **Top 3 patterns** — most common quality issues across the plugin
3. **Strongest files** — files that exemplify good quality (if any)
4. **Priority actions** — ordered list of highest-impact fixes

---

## 7. Save report (optional)

Use AskUserQuestion to ask:

> Save this audit report to the plugin directory?

Options:

- **Yes** — save as `AUDIT-REPORT.md` in the plugin root
- **No** — display only, do not save

If the user selects **Yes**, use the Write tool to create `<plugin-path>/AUDIT-REPORT.md` containing:

```markdown
# Content quality audit report

**Plugin:** <plugin-name>
**Date:** <current date>
**Grade:** <grade> — <characterization>

<ASCII art badge>

---

## Tier distribution

| Tier | Count | Percentage |
| ------ | ------ | ------ |
| Exemplary | N | N% |
| Strong | N | N% |
| ... | ... | ... |

---

## Per-file assessments

<all per-file dimension tables from step 3>

---

## Findings

<full findings table from step 4>

---

## Summary

<top 3 patterns, strongest files, priority actions from step 6>
```

---

## Verification checklist

- [ ] Every `.md` file in the plugin was read and evaluated
- [ ] Each file has a per-file dimension assessment table
- [ ] Each finding has a specific file, concrete issue description, and actionable suggestion
- [ ] Tier labels applied consistently across files (same standard for "Strong" everywhere)
- [ ] No false positives from standard markdown structure (headings, links, frontmatter)
- [ ] Description fields checked for SKILL.md files, rated N/A for others
- [ ] Inferable content flagged only when genuinely obvious to the model
- [ ] Grade derived from actual tier distribution, not gut feeling
- [ ] ASCII art badge matches the assigned grade
- [ ] Summary patterns reflect actual finding distribution
- [ ] If user chose to save, AUDIT-REPORT.md written with all sections

---

## Cross-references

- [Prompt techniques](../../references/clankgster-context-engineering-prompt-techniques.md) — quality criteria for emphasis, XML tags, framing, examples
- [Writing descriptions](../../references/clankgster-context-engineering-writing-descriptions.md) — description field evaluation criteria
- [Writing rules](../../rules/clankgster-context-engineering-writing-rules.md) — rule file conventions
- [Writing skills](../../rules/clankgster-context-engineering-writing-skills.md) — skill file conventions
