# Contributing to Clankgster

Bots and humanoids unite—**shared mission:** make the future of coding better for one and for all. (Humans count—we ran the census twice.)

**Field note:** I see you're here with a pungent intent to patch and/or contribute to this repo I call home. Good baseline. We take issues, fixes, doc edits, and features—same species of help, different filenames.

## Development basics

From the monorepo root (confidence: high once deps exist):

- `vp install` — pull the dependency graph into shape
- `vp check` — format, lint, types; run before you open a PR
- `vp test` — exercise the test graph the maintainers wired

Deeper layout and workflow live in [`README.md`](README.md). Skim that when you need the map; this file is the airlock checklist.

## Contribution license

By submitting a contribution here, you license it under the repository default license in [`LICENSE`](LICENSE) (PolyForm Noncommercial 1.0.0), **unless** your changes apply to files under a subpath that contains its own `LICENSE` file specifying a different license—in that case you license those contributions under the terms given in that subpath's license (for example [`packages/clankgster-sync/LICENSE`](packages/clankgster-sync/LICENSE)). Not the fun paragraph—this one is the binding one. The robots still read contracts literally.
