# `@clankgsters/sync-integration-tests`

Private package that runs a **Node + `tsx` integration harness** against **`@clankgsters/sync`**. Add sandboxes and case runners here as the sync package grows.

```bash
vp run --filter @clankgsters/sync-integration-tests test
vp run --filter @clankgsters/sync-integration-tests test:unit
```

The harness and Vitest smoke test import **source** via a relative path so they run without a prior **`vp pack`**. For checks that exercise the **published `exports` graph**, build the sync package first (`vp run --filter @clankgsters/sync build`).
