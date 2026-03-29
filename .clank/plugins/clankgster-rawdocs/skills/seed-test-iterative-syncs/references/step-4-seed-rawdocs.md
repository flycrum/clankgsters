# Step 4 — Seed `rawdocs/` from test-complex bundle (complex plugin only)

Copy **every** `*.md` file from this plugin’s canonical bundle:

* Source directory: [`references/test-complex-rawdocs/`](../../../references/test-complex-rawdocs/) (repository-root path: `.clank/plugins/clankgster-rawdocs/references/test-complex-rawdocs/`)

Into:

* `target_plugin_path/rawdocs/`

## **Rules**

* Preserve **filenames** exactly (e.g. `testing-types.readme.md`, `turborepo-general.readme.md`, …).
* Copy **file contents verbatim**; do not rewrite Mars-relative links for this test harness (they are intentional sample noise for structural sync).
* Do **not** create `rawdocs/getting-started.md` from the simple template for this skill.
