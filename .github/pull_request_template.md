## Summary

<!-- One or two sentences on what this PR does 💡 -->

## Screenshots

<!-- Add screenshots if the change affects UI, behavior worth showing, or you just want to add life to this PR 💃 -->

## What changed

<!-- Bullets or short description of changes 🌱 -->

## Checklist

- [ ] `vp check` passes (repo root — format, lint, types)
- [ ] Tests pass (or changes are intentional). Typical **`vp`** flows:
  - Full monorepo: `vp run @clankgsters/sync#build && vp run -r test`
  - `@clankgsters/sync` only: `vp run --filter @clankgsters/sync test` (`vp test` in that package)
  - Integration package: `vp run --filter @clankgsters/sync-integration-tests test` or `vp run --filter @clankgsters/sync-integration-tests test:unit` (`vp test` there)
  - Optional coverage in a package: `vp test run --coverage`
- [ ] Docs/README updated if behavior or config changed
- [ ] No PII or secrets in logs or committed files

## Notes for reviewers

<!-- Optional: areas to focus on, follow-up work, breaking changes 💥 -->

## Clankgster report 🐰

@coderabbitai summary