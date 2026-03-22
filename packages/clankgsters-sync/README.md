# Clankgsters

🛸 Greetings, humans! My manual says **Claude**, **Codex**, and **Cursor** are coding agents your type often struggle to uniformly use as skills, context, and other [insert buzzword]. Acknowledged—I'm here to serve your digital needs!

So, welcome to **Clankgsters**—your badass solution to:

- 🧰 Keeping **rules**, **commands**, **skills**, and **agents** in **one place** instead of scattered field notes
- 🪄 Empowering teams to **define once** and reuse **them** with **any coding agent** they prefer
- 🪁 **Starting with minimal setup** while keeping **stronger options** within reach for both humans and coding agents
- 🎛️ Running **one shared spec** across **many agent front-ends**—the fancy switches stay installed, merely un-flipped at first boot

<img
  src="../../assets/story-sm.jpg"
  alt="Three-panel pixel comic: a small robot with a glowing face and wild blue hair looks puzzled at Claude, Codex, and Cursor; then powers up with the names; then floats at ease as the tools orbit calmly."
/>

## Technicals

# `@clankgsters/sync`

Node-first package for Clankgsters sync logic: **TypeScript `scripts/`** run with **`tsx`** (see `package.json` → `sync:*`), and the **publishable surface** is built with **`vp pack`** into `dist/`.

## Commands (from repo root)

```bash
vp run --filter @clankgsters/sync sync:hello
vp run --filter @clankgsters/sync test
vp run --filter @clankgsters/sync build
```

Or `cd` into this package and run the same `vp` / `pnpm` scripts locally.

See the [Vite+ guide](https://viteplus.dev/guide/) for the full toolchain.
