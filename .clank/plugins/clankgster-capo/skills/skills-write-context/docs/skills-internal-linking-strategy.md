# Internal linking and ownership (clankgster-capo skills)

This document describes how **this plugin** organizes markdown under `skills/<skill-name>/` versus plugin-root `references/`, `rules/`, and `docs/`, and why those choices exist. It is **internal** maintenance context for `clankgster-capo` authors and agents refactoring this tree—not a portable standard for every Clankgster plugin.

---

## Goals

1. **Clear ownership** — Readers should know which skill “owns” a piece of guidance so updates happen in one place.
2. **Progressive disclosure** — Heavy material lives where it is loaded only when a workflow links to it, not inlined into every `SKILL.md` body.
3. **Predictable cross-links** — Other skills, rules, and plugin `docs/` may point at owned files when they need depth; paths stay stable.
4. **Boundary safety** — Plugin-root `references/` remain safe to load from broad, always-on-style material without dragging the whole executable skill tree into scope via markdown links.

---

## Layout inside `skills/<name>/`

Next to each `SKILL.md`, a skill directory may include:

| Path | Role |
| --- | --- |
| `reference.md` | Single **hub**: read order, what the skill owns vs what stays shared, and links into `docs/` and `references/`. |
| `references/` | One or more **first-class** supporting markdown files when a hub alone is not enough (e.g. a dedicated prompt addendum). |
| `docs/` | **Deep dives**: templates, long checklists, topic-specific guides, and internal strategy notes. |

Nothing here defines a **new** auto-load tier: skill-local files load when linked from an active skill/rule or when the user or steps explicitly say to read them—same link-driven behavior as elsewhere in the plugin.

---

## Using `reference.md`, `references/`, or both

- **`reference.md` only** — Enough when the skill has a short read order and all depth lives in plugin-root `references/` or `docs/`.
- **`docs/` only** — Rare without a hub; without `reference.md`, callers must link each `docs/*.md` path directly.
- **`references/` under the skill** — Use when the skill owns multiple support files at similar “weight” (e.g. a prompt addendum separate from the hub).
- **Hub + `docs/` + `references/`** — Valid when one index (`reference.md`) sequences **both** `docs/*.md` and `references/*.md`. Example in this plugin: `skills-write-context` lists description guides and templates under `docs/`, and `references/skill-prompt-techniques.md` for orchestration addenda, all from one hub.

Prefer **one hub read** per workflow: `SKILL.md` steps point to `reference.md`; the hub lists deeper files so the agent does not chase duplicate cross-references.

---

## What “ownership” means

- **Owned by the skill** — Content that exists primarily to serve that skill’s workflow (templates, skill-specific prompt patterns, internal strategy for that pathway). Changes should be reviewed in the context of that skill.
- **Shared at plugin root** — `references/common-*.md`, matrix docs under `docs/plugins-matrix-*.md`, and similar material used by **many** skills or rules. Owned collectively; change with broader impact in mind.

Colocation rule: if material is **mostly** about one skill’s execution, keep it under that skill’s `docs/` or `references/`. If it is **broadly** reused across pathways or content types, keep it under plugin-root `references/` or `docs/`.

---

## Who may link to whom

Allowed (markdown links):

- **Skill → plugin-root `references/` or `docs/`** — Normal; shared baselines live there.
- **Skill → another skill’s `reference.md`, `docs/`, or `references/`** — Normal when one workflow defers to another hub (e.g. plugin authoring deferring to `skills-write-context` for `SKILL.md` depth).
- **`rules/` → `skills/`** — Normal; rules often point authors at the right skill hub.
- **Plugin `docs/` → `skills/`** — Normal for deep internal docs.

**Strict requirement (this plugin):** files under plugin-root **`references/`** must **not** contain markdown links into `skills/`, `rules/`, `commands/`, or `agents/`.

Reasons:

- Root `references/` are treated as **boundary-safe** shared material. Linking into executable trees ties those files to skill layout churn and creates awkward load orders when a rule pulls a reference that immediately points back into a skill subtree.
- **Discoverability without reverse links** — Skill addenda (e.g. skill-only prompt slices) live under the owning skill; plugin-root `common-prompt-techniques.md` uses **plain repository paths** in prose where readers need a pointer, instead of a markdown link into `skills/`, so the boundary stays enforceable.

Other trees (`rules/`, `skills/`, `docs/`) may link into `skills/` freely.

---

## Templates and addenda (naming)

Skill-owned templates and addenda use **type-first** filenames where practical (e.g. `skill-template.md`, `skill-prompt-techniques.md`, `skill-asking-for-user-input.md`) so they sort clearly next to other skill `docs/` and are not confused with plugin-root `common-*` files.

---

## Relation to pathway rules

- **`rules/skills-write-rules.md`** — Short always-on conventions for any `SKILL.md` in this repo (structure, description rules, MCP frontmatter guardrails). It links **into** `skills-write-context` for depth.
- **`skills-write-context`** — The authoring **hub** for standalone and plugin `SKILL.md` quality, via `reference.md` and owned `docs/` / `references/`.

---

## Summary

| Location | Typical content | Linking notes |
| --- | --- | --- |
| `skills/<name>/SKILL.md` | Invocation workflow | Link to `reference.md` or shared refs. |
| `skills/<name>/reference.md` | Read order, ownership | May link to `docs/`, `references/`, and plugin-root refs/docs. |
| `skills/<name>/docs/` | Templates, long guides | Consumed via hub or direct links from other skills/rules. |
| `skills/<name>/references/` | Parallel support files | Same as `docs/`; use when multiple peers sit beside the hub. |
| `references/common-*.md` | Cross-cutting baselines | **Do not** markdown-link into `skills/`, `rules/`, `commands/`, `agents/`. |

This layout is **specific to how `clankgster-capo` is maintained**; other plugins may adopt a subset or different naming if their sync and loading model differ.
