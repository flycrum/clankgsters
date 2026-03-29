# Run 1 — baseline structural sync

1. Read and summarize the current `rawdocs/` tree under `TARGET_PLUGIN_PATH` (file list + short content summary).
1. Run [`rawdocs-struct-sync`](../../struct-sync/SKILL.md) for `TARGET_PLUGIN_PATH` and wait for completion.
1. Snapshot and analyze resulting changes under `TARGET_PLUGIN_PATH` **outside** `rawdocs/` (file list + content-level summary).
1. Produce a tiny **run-1** source-to-output trace map artifact (rawdocs section or file -> generated/updated non-`rawdocs/` paths).
