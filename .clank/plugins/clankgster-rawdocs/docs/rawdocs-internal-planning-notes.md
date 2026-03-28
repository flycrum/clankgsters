# rawdocs internal planning notes

## Purpose of this planning document

This document captures the internal strategy, constraints, and workflow intent for the new `clankgster-rawdocs` plugin. It is intentionally verbose. The priority is to preserve original intent with minimal interpretation drift, especially around:

- strict `rawdocs/` boundary handling
- isolated dual-analysis architecture
- continuity-vs-evolution planning
- low-creativity content porting from `rawdocs/`

## High-level system intent

`clankgster-rawdocs` exists to let users create plugin context without manually splitting content into `rules/`, `skills/`, `references/`, `docs/`, and other plugin content folders.

User workflow:

1. User creates/maintains one or more files in plugin-local `rawdocs/`.
2. User opts in simply by having `rawdocs/` present in that plugin.
3. `rawdocs-struct-sync` ingests and analyzes `rawdocs/` in isolation.
4. Structify sync flow outputs organized plugin files outside `rawdocs/`.
5. `rawdocs/` remains unchanged and unlinked from authored plugin files.

## Dependency and architecture relationship to clankgster-capo

- `clankgster-rawdocs` is intentionally dependent on `clankgster-capo` guidance.
- Cross-plugin links are used as an explicit exception in this plugin.
- `clankgster-capo` references are used as organizational lens and plugin-authoring quality baseline.

Primary references:

- `../../clankgster-capo/skills/plugins-create-context/SKILL.md`
- `../../clankgster-capo/skills/plugins-create-context/reference.md`

## Non-negotiable boundary rules

### 1) rawdocs directory placement and opt-in behavior

`rawdocs/` must be colocated with standard plugin folders (same level as `rules/`, `skills/`, `references/`, `docs/`, etc) in the target plugin.

Presence of that folder is implicit opt-in to rawdocs structural sync mode.

### 2) no-link boundary (hard rule)

Plugin-authored content must never link to files in `rawdocs/`.

This includes:

- `rules/`
- `skills/`
- `references/`
- `docs/`
- `commands/`
- `agents/`
- `hooks/`

`rawdocs/` is input-only. Not a published reference surface.

### 3) preservation boundary

`rawdocs-struct-sync` must never delete or modify `rawdocs/` during cleanup/rewrite steps.

## Skill architecture created for this plugin

### Core orchestrator

- `skills/struct-sync/SKILL.md`

### Isolated analyzers

- `skills/analyze-raw/SKILL.md`
- `skills/analyze-existing/SKILL.md`

### Supporting architecture docs

- `references/rawdocs-structify-architecture.md`
- `rules/rawdocs-internal-linking.md`
- `skills/struct-sync/references/rawdocs-execution-notes.md`
- `skills/struct-sync/references/rawdocs-target-input.md`

## Draft plan (pass 1)

This first pass captures the complete workflow model exactly as requested.

### Step 1: Explicit target input capture

- Ask user for target plugin path or `rawdocs/` path.
- Normalize into canonical variables:
  - `target_plugin_path`
  - `target_rawdocs_path`
- Reuse these exact values throughout all later steps.

### Step 2: Isolated rawdocs-only analysis (sub-agent)

Run `rawdocs-analyze-raw` in an isolated sub-agent.

Required behavior:

- analyze only `target_rawdocs_path`, recursively
- do not read non-text formats
- reference capo plugin authoring guidance
- determine themes/objectives from rawdocs content
- profile writing style (tone, header habits, quote preference, etc)
- run supporting web research for similar theme/plugin patterns
- propose organization strategy with near-zero creativity for content transformation
- return extensive output package for downstream synthesis

### Step 3: Isolated existing-plugin analysis excluding rawdocs (sub-agent, parallel)

Run `rawdocs-analyze-existing` in separate isolated sub-agent.

Required behavior:

- analyze all plugin content recursively except `rawdocs/`
- build sitemap and structure model
- if plugin is empty outside `rawdocs/`, return "New and or empty" result and from-scratch guidance
- otherwise summarize file purposes and section outlines at high level
- capture style continuity profile
- avoid dense textual extraction from existing files
- return extensive output package for downstream synthesis

### Step 4: Join point and scope verification

- wait for both analyzer outputs
- verify non-overlap of read scopes
- verify complete combined coverage

### Step 5: Combined strategic plan

Construct integrated plan that:

- uses rawdocs meaning/style as source truth
- uses existing structure as continuity baseline
- allows strategic structural evolution for scale
- excludes any modification to `rawdocs/`

### Step 6: Refinement pass

Run second planning pass focused on:

- continuity across repeated structural sync runs
- long-term scalability
- stable naming and grouping where possible
- justified restructuring when needed
- strict style/tone preservation

### Step 7: Clean target plugin except rawdocs

- remove all target plugin folders/files except `rawdocs/`
- include guard rails so `rawdocs/` is never deleted

### Step 8: Rebuild from refined plan

- write full plugin output structure and content
- keep creativity near-zero when porting text
- apply only conservative grammar/spelling updates

### Step 9: Final verification

- rawdocs preserved
- no links to rawdocs
- output tree matches plan
- continuity constraints respected

## Refinement plan (pass 2)

This pass tightens the strategy for repeatability and quality over multiple structural sync cycles.

### Refinement priority 1: deterministic scope enforcement

- Every delegated prompt must restate include/exclude path boundaries.
- Analyzer outputs must include explicit "scope compliance" section.
- Parent workflow must reject and rerun any analyzer output that violates boundary scope.

### Refinement priority 2: continuity memory without content bloat

- Existing-plugin analyzer should capture structural and stylistic metadata, not full text payloads.
- Keep continuity anchors lightweight:
  - file purpose
  - section heading skeleton
  - naming convention notes
  - tone/style signatures

### Refinement priority 3: architecture evolution heuristics

Evolve structure only when one or more triggers are present:

- a file has multiple unrelated themes and should split
- repeated content appears across files and should consolidate
- naming no longer matches actual scope
- section growth causes readability/maintainability risks

If triggers are absent, preserve existing layout for continuity.

### Refinement priority 4: low-creativity fidelity contract

Porting policy should remain explicit:

- preserve phrase choices from rawdocs by default
- preserve section voice and cadence
- preserve punctuation and quote style where intentional
- limit edits to clear correctness fixes

### Refinement priority 5: hardened cleanup safety

Before deletion:

1. produce candidate delete list
2. remove all `rawdocs/` descendants from that list
3. execute deletion on filtered list only
4. verify `rawdocs/` still exists

### Refinement priority 6: anti-drift link policy

Post-write validation must include a scan for markdown links targeting `rawdocs/`, and fail the run if any are found.

## Expected skill outputs summary

### `rawdocs-analyze-raw` expected output quality

- extensive and complete
- style-aware
- source-faithful
- organization-oriented

### `rawdocs-analyze-existing` expected output quality

- extensive and complete
- continuity-focused
- high-level summaries, not content dumps
- explicit empty-plugin handling

### `rawdocs-struct-sync` expected output quality

- strategic and refined
- strongly constrained
- safe cleanup behavior
- reproducible from run to run

## Notes on explicit redundancy in prompts

Repeated reminders to exclude/include `rawdocs/` in specific phases are intentional and must be preserved, not deduplicated away for brevity.

## Implementation artifacts created in this work

- `README.md`
- `.claude-plugin/plugin.json`
- `.cursor-plugin/plugin.json`
- `rules/rawdocs-internal-linking.md`
- `references/rawdocs-structify-architecture.md`
- `skills/struct-sync/SKILL.md`
- `skills/struct-sync/references/rawdocs-execution-notes.md`
- `skills/struct-sync/references/rawdocs-target-input.md`
- `skills/analyze-raw/SKILL.md`
- `skills/analyze-existing/SKILL.md`
- this planning file: `docs/rawdocs-internal-planning-notes.md`

## Near-verbatim transcript of original request (light spelling/grammar corrections)

I want to add a new concept to our `@.clank/plugins/clankgster-capo`, which, as a reminder, currently does this in `@.clank/plugins/clankgster-capo/.claude-plugin/plugin.json:4`. The new idea is called `rawdocs/`. Here is the gist:

- this is going to be a new plugin located in `@.clank/plugins`
- the name of the plugin will be `clankgster-rawdocs`
- it is closely related to and dependent on the `@.clank/plugins/clankgster-capo` plugin and its content (it is not ideal to cross-reference or use markdown links across different plugin boundaries, but we will make an exception in this case)
- the high-level intent behind this plugin will be to aid in the organization of a user-created plugin (for example, `@.clank/plugins/clankgster-capo/rules/common-organizing-content.md`) and even related to some of the decision-making in `@.clank/plugins/clankgster-capo/skills/common-triage-context-type/SKILL.md`
- but first, I want to note that EVERYTHING in these directions should be captured and documented in a `docs/rawdocs-internal-planning-notes.md` file within its `docs/` folder (too much is better than too little for documenting our conversation in that file)
- the purpose of this system, which I want clearly documented, is to allow users to create a plugin but not have to organize and split out the contents themselves
- instead, the user would have one or more docs in a new `rawdocs/` directory
- the user would opt into this system, implicitly, by having/creating this `rawdocs/` directory within their plugin, colocated with the folders mentioned in this doc: `@.clank/plugins/clankgster-capo/rules/common-organizing-content.md:17-22` (in other words, on the same level as them)
- the files in the `rawdocs/` directory would never, never be referenced/linked by other files in its plugin -- hard boundary rule (for example, `rules/`, `skills/`, `docs/`, `references/`, etc. could not and would not ever link to files in this `rawdocs/` directory (EVER, so we need to scream this, maybe make it a `rules/rawdocs-internal-linking.md`)
- the idea is that the files in `rawdocs/` are the "raw input that `clankgster-capo` can take, interpret, organize, split out, and output into a well structured series of plugin folders and files representing the intended context of the raw documents made up in `rawdocs/` but organized into a plugin structure that follows best practices, is efficient, and is effective"
- this also can help the challenge of scaling documentation because how to organize or architect a plugin of growing content is less of a burden on developers, as they can effectively dump information into a file in this `rawdocs/` directory, not worry about structure or how to organize content, and then this `rawdocs` system will take that, process it, and thoughtfully output it into well organized plugin content and context

So, a few important things to note:

- our `rawdocs` system will be powered by skills defined in its own plugin

the primary skill should be named `rawdocs-struct-sync` and will:

1. run the following in a new sub-agent to take either the user's input to their target plugin path OR `rawdocs/` path as INPUT (for example, using `@.clank/plugins/clankgster-capo/skills/skills-create-context/docs/skill-asking-for-user-input.md`, like this `@.clank/plugins/clankgster-capo/skills/skills-audit-full-suite-skill/resources/skills-target-input.md`, but not exactly; we can write our own steps and context for this). Also make sure to track the path the user provides as the user's "target plugin" path, as we will reference it throughout this skill and need to use it again in later steps.
2. then this skill will run in a new sub-agent (so context does not bleed into the rest of the skill's context window; it needs to be isolated) and will analyze **only** the user's custom plugin's **`rawdocs/`** directory and its contents/context (including nested files). Restricting the analyze step to only this `rawdocs/` is absolutely critical to output success. This analyze step, running in a sub-agent, should be a separate skill from `rawdocs-struct-sync`, named `rawdocs-analyze-raw`. Its job is:
   a. REFERENCE CAPO: reference `clankgster-capo` docs on how to create, organize, and structure a plugin (link to `@.clank/plugins/clankgster-capo/skills/plugins-create-context/SKILL.md`)
   b. READ RAWDOCS: read raw/unstructured file contents (text-based formats only; do not read non-text like images, binary, zip, etc.) within target plugin `rawdocs/` and determine high-level themes/objectives (examples: typescript, figma-to-code, ui design, testing, publish to npm, deploy to CI, monorepo conventions, error debugging, security compliance, security scanning, frontend playbook, backend playbook, git pr workflows, documentation, database design, database migration, codebase cleanup, accessibility/compliance, etc.). Pay attention to writing style (very important), tone, habits, preference for single vs double quotes in code, section header patterns, and more so we can guide future writing.
   c. RESEARCH THEME: do web research for how others have written similar plugins for those themes/objectives
   d. ANALYZE RAWDOCS: analyze `rawdocs/` from the perspective of organization, grouping, file breakout strategy, and logical content structure, through the lens of capo guidance in `@.clank/plugins/clankgster-capo/skills/plugins-create-context/reference.md`. Highly respect existing writing. Goal is not wordsmithing. Creativity should be virtually zero; temperature near 0. Spelling/grammar updates are allowed but must be judicious.
   e. OUTPUT: output from this sub-agent must be extensive and complete for later steps.
3. simultaneously, run a separate new sub-agent (isolated context) to read all other plugin contents/context (including nested), excluding **`rawdocs/`**. This should also be a separate skill from `rawdocs-struct-sync`, named `rawdocs-analyze-existing`. Its job is:
   a. IDENTIFY CURRENT STRUCTURE: recursively scan and formulate a sitemap of current file structure for target plugin excluding `rawdocs/`; determine high-level organization/themes. Empty or near-empty plugin is acceptable; if empty aside from `rawdocs/`, skip sub-steps and return output indicating plugin is "New and or empty" and sync should proceed "from scratch"
   b. READ REST OF PLUGIN: if not empty, recursively read all text-based files (skip non-text), and capture high-level outline, purpose, organization style, writing style/tone/habits, quote preference, header style, etc. Goal is consistency for future updates. Important: do NOT include too many specific textual inclusions in final output except what is needed for purpose/outline/critical notes.
   c. OUTPUT: output from this sub-agent must be extensive and complete for later steps.
4. in this step, wait for both prior skills. Together, `rawdocs-analyze-raw` and `rawdocs-analyze-existing` should collectively analyze all plugin folders/files/content recursively, without overlap, to form a full picture.
5. once both outputs are available, thoughtfully combine into one plan to:
   - update all target plugin files/folders/content EXCEPT `rawdocs/` (leave `rawdocs/` as-is, unaltered)
   - treat `rawdocs-analyze-raw` content as source truth for meaning/content, but not for folder/file shape
   - treat `rawdocs-analyze-existing` structure as guiding continuity reference, while evolving/scaling as needed (split, merge, rename, regroup, re-express purpose)
6. run a second refinement pass on that plan, strategically balancing continuity and scalability while preserving style/tone/habits/quote/header conventions.
7. then recursively remove all files/folders under target plugin path except `rawdocs/` (extremely important not to delete `rawdocs/`).
8. then write new folders/files/content from refined plan.
9. once complete, ...

You may notice that I repeatedly reminded the LLM that `rawdocs/` should be excluded from consideration for particular steps. This is important to keep, so do not remove those reminders as "redundant."

I want these skills to be extremely thorough and extensive. Do not cut out context, purpose, or specifics we discussed. Over-documenting is better than under-documenting for this effort. I want all skills and documentation created here to be verbose and thorough. I am okay with it not being concise for the sake of brevity.

Once you have generated a plan, do another refinement pass following all directions above, with special respect for the precise instructions and careful documentation. I will want to save this plan and I want a lot of my exact words and intentions included. In fact, write the plan how you normally would, but include a transcript of my original instructions at the bottom (nearly verbatim, with only small spelling/grammar corrections, or slight wording corrections when context clearly indicates intent).
