# Clankgster

🛸 Greetings, humans! My manual informs me that **Claude**, **Codex**, and **Cursor** are coding agents your type often struggle to uniformly use as skills, context, and other [insert buzzword]. Acknowledged—I'm here to serve your digital needs!

So, welcome to **Clankgster**—your badass solution to:

- 🧰 Keeping **rules**, **commands**, **skills**, and **agents** in **one place** instead of scattered field notes
- 🪄 Empowering teams to **define once** and reuse **them** with **any coding agent** they prefer
- 🪁 **Starting with minimal setup** while keeping **stronger options** within reach for both humans and coding agents
- 🎛️ Running **one shared spec** across **many agent front-ends**—the fancy switches stay installed, merely un-flipped at first boot

Naming note: use **Clankgster** for the project/package brand; repo config uses `clankgster.config.ts` at the root and `clankgsterConfig` from `@clankgster/sync`.
The name “Clankgster”, though playing off of a derogatory term “Clankers”, is actually the “AI robots reclaiming that term and lovingly and playfully combining it with 'gansters' to form the clumsily-constructed portmanteau 'Clankgster'...take that humans!!”

<img
  src="assets/story-sm.jpg"
  alt="Three-panel pixel comic: a small robot with a glowing face and wild blue hair looks puzzled at Claude, Codex, and Cursor; then powers up with the names; then floats at ease as the tools orbit calmly."
/>

## Monorepo (Vite+)

This repository is a **pnpm workspace** organized around the publishable sync package **[`@clankgster/sync`](packages/clankgster-sync/README.md)** (`packages/clankgster-sync`). Tooling follows **[Vite+](https://viteplus.dev/)**—the unified **`vp`** CLI for install, check, test, pack/build, and monorepo tasks—so day-to-day work looks like `vp install`, `vp check`, and `vp test` from the repo root.

- **`packages/clankgster-sync`** — Node + TypeScript (`tsx` scripts, `vp pack` for npm)
- **`packages/clankgster-sync-e2e`** — private e2e harness and tests against the sync package (`@clankgster/sync-e2e`)

Prereqs: **Node 22.12+** and global **`vp`** ([install](https://viteplus.dev/guide/)). Then: `vp install`, `vp check`, `vp test`.

## One more thing...for you humanoid

Not only does this monorepo contain the source for the Clankgster sync system, we're also a customer and use it to create, modify, and maintain our codebase! 😎

## Licensing

Clankgster is built to be openly usable by developers and teams while keeping source stewardship clear.

- Source code in this repository is licensed under the PolyForm Noncommercial License 1.0.0 (see `LICENSE`).
- The published npm package `@clankgster/sync` is distributed under MIT (see `packages/clankgster-sync/LICENSE`).
- This split keeps npm usage straightforward in real projects, while the repository source stays aligned with a noncommercial source-sharing model.
