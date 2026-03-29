# Run 2 — structural sync after mutation

1. Re-run [`rawdocs-struct-sync`](../../struct-sync/SKILL.md) for `TARGET_PLUGIN_PATH` and wait for completion.
1. Snapshot and analyze resulting changes again under `TARGET_PLUGIN_PATH` outside `rawdocs/`.
1. Produce a tiny **run-2** source-to-output trace map artifact (rawdocs section or file -> generated/updated/removed non-`rawdocs/` paths).
1. Compare first-run vs second-run non-`rawdocs/` outputs and classify churn severity using [shared-churn-severity.md](../../../references/tests/shared-churn-severity.md).
1. Report observations against goals in [`rawdocs-sync-goals.md`](../../../references/rawdocs-sync-goals.md) and [`rawdocs-structify-architecture.md`](../../../references/rawdocs-structify-architecture.md), with explicit callout for: **"Maintain continuity across repeated structural sync runs while allowing structure to evolve."**
