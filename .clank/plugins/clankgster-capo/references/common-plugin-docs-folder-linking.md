# Plugin `docs/` folder and markdown linking

**Purpose:** Describe how top-level plugin `docs/` relates to `references/`, rules, and skills when authoring cross-links. Applies to plugins under source pathway `plugins/` (a directory that contains `rules/`, `skills/`, `references/`, and `docs/`).

## Rationale

Top-level `docs/` is for **background and orientation** material that readers open deliberately (README indexes, deep dives). It is **not** the default home for prose that other **rules**, **references**, or **skills** must navigate to via markdown links.

If something is linked from `rules/`, `references/*.md`, or `skills/**` (except skill-local paths below), treat it as **shared depth**: prefer `references/<name>.md` at plugin level, or for a single skill’s depth use that skill’s `reference.md` or skill-owned `references/*.md` / `docs/*.md` under the same `skills/<name>/` tree.

## Linking rules (navigational relative links)

When evaluating a relative markdown link, resolve source and target paths from the plugin root (`pluginRoot`: the folder that directly contains `rules/`, `skills/`, `references/`, and `docs/`).

1. If the **resolved target file** is **not** under `pluginRoot/docs/`, these rules do not apply.
2. If the **source file** is under `pluginRoot/docs/`, links are allowed (including to other files under `docs/`).
3. If the **source file** is `pluginRoot/README.md`, links into `pluginRoot/docs/` are allowed (index role).
4. If the **source file** is `pluginRoot/references/common-content-type-comparison-matrix.md` and the target basename matches `plugins-matrix-*.md` under `pluginRoot/docs/`, the link is allowed (designated matrix → detail-doc hub).
5. If the **source file** is under `pluginRoot/skills/<skillName>/` and the **resolved target** is under the same `pluginRoot/skills/<skillName>/` directory, the link is allowed (skill-local `docs/` / `references/` stay inside the skill subtree).
6. Otherwise the link **violates** this policy: the target should move to `references/` or the relevant skill `reference.md` / skill-owned subtree, or the source should link only through an approved hub (e.g. the content-type matrix) that lists `docs/` children.

**plugins-audit-internal-links** reports violations as **`docs/` target policy** findings (valid on disk but disallowed here); see [internal-links-plugin-docs-folder-policy.md](common-audit/internal-links-plugin-docs-folder-policy.md).

## Cross-references

- [common-organizing-content.md](../rules/common-organizing-content.md)
- [common-content-type-decision-tree.md](common-content-type-decision-tree.md)
