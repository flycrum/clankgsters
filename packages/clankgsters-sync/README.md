# Clankgsters

🛸 Greetings, humans! My manual informs me that **Claude**, **Codex**, and **Cursor** are coding agents your type often struggle to uniformly use as skills, context, and other [insert buzzword]. Acknowledged—I'm here to serve your digital needs!

So, welcome to **Clankgsters**—your badass solution to:

- 🧰 Keeping **rules**, **commands**, **skills**, and **agents** in **one place** instead of scattered field notes
- 🪄 Empowering teams to **define once** and reuse **them** with **any coding agent** they prefer
- 🪁 **Starting with minimal setup** while keeping **stronger options** within reach for both humans and coding agents
- 🎛️ Running **one shared spec** across **many agent front-ends**—the fancy switches stay installed, merely un-flipped at first boot

Naming note: use **Clankgsters** for product/package naming; config filenames and the helper export use the plural form (`clankgsters.config.ts`, `clankgstersConfig.define`).
The name “Clankgsters”, though playing off of a derogatory term “Clankers”, is actually the “AI robots reclaiming that term and lovingly and playfully combining it with 'gansters' to form the clumsily-constructed portmanteau 'Clankgsters'...take that humans!!”

<img
  src="../../assets/story-sm.jpg"
  alt="Three-panel pixel comic: a small robot with a glowing face and wild blue hair looks puzzled at Claude, Codex, and Cursor; then powers up with the names; then floats at ease as the tools orbit calmly."
/>

## Technicals

# `@clankgsters/sync`

Node-first package for Clankgsters sync logic: implementation lives under **`src/`**; **`scripts/`** holds CLI entry files run with **`tsx`** (see `package.json` → `clankgsters-sync:*`), and the **publishable surface** is built with **`vp pack src/index.ts`** into `dist/`.

## Commands (from repo root)

```bash
vp run --filter @clankgsters/sync test
vp run --filter @clankgsters/sync build
```

Or `cd` into this package and run the same `vp` / `pnpm` scripts locally.

See the [Vite+ guide](https://viteplus.dev/guide/) for the full toolchain.

## Repo root resolution

Sync loads `clankgsters.config.ts` from the **repository root** (the tree that contains your source layouts such as `.clank/` and shorthand siblings like `.clank-plugins`), not from `process.cwd()` alone.

- **Default:** repo root is derived from the `@clankgsters/sync` package location (so `pnpm -F @clankgsters/sync run clankgsters-sync:run` from the monorepo root still finds the root `clankgsters.config.ts`).
- **`CLANKGSTERS_REPO_ROOT`:** optional absolute path override (sandboxes, tests, or when you need an explicit root).
- **Published CLI:** `clankgsters-sync` (see `package.json` → `bin`) sets `CLANKGSTERS_REPO_ROOT` to the **current working directory** and runs the sync entry with this package’s `tsx` loader (for global or linked installs).

Implementation details live in `src/common/path-helpers.ts` (TSDoc).

## Trust sync (edit `.clank/`, not `.cursor/` / `.claude/`)

- **Sources:** `.clank/plugins/`, `.clank/skills*` (and layouts in config), `clankgsters.config.ts`
- **Do not** manually symlink, copy, or “register” rules, commands, skills, or plugins under `.cursor/`, `.claude/`, Codex outputs, or marketplace JSON — **run sync** and fix the pipeline if something is missing
- **Command:** read **`packages/clankgsters-sync/package.json`** (this package) for the current **`clankgsters-sync:run`** / **`clankgsters-sync:clear`** scripts, then run from the repo root; verify outputs afterward
- **Detail:** [clankgsters-sync-trust-sync-workflow.md](.clank/plugins/clankgsters-sync/rules/clankgsters-sync-trust-sync-workflow.md) in the driver plugin (shipped in-repo)

## Field note: sync is not a hostile takeover

**Hypothesis (tested, confidence: high):** `clankgsters-sync` is **not** an all-or-nothing wipe of Claude, Cursor, or Codex context. You can **eat your human cake and have it too!**—keep the skills, commands, rules, plugins, marketplaces, and odd folders you (or your agent) added by hand, **and** let Clankgsters materialize its slice from `.clank/` and `clankgsters.config.ts` beside them.

**What we observed in this monorepo (real paths, not a toy diagram):**

- After **`clankgsters-sync:clear`**, trees like **`.cursor/plans/`** and manually curated **`.cursor/skills/*`** (for example the Vite+ skill packs) were still present; so were files such as **`.claude/skills/vibe-check.md`** and unrelated rule folders under **`.claude/rules/`**. Nothing in that “human/agent-native” neighborhood was deleted just because we cleared sync outputs.
- After **`clankgsters-sync:run`**, the same files were **still there**, **plus** the Clankgsters-managed material (for example **`.claude/rules/clankgsters-sync/`**, **`.cursor/rules/clankgsters-sync/`**, synced skill folders, **`.claude-plugin/marketplace.json`** when that behavior is enabled). Picture roommates moving furniture in—**your** shelves stayed; **ours** appeared next to them.

**Shared JSON, handled with care:**

- **`.claude/settings.json`:** sync **reads** whatever JSON is already there, then writes the keys it owns (`extraKnownMarketplaces`, `enabledPlugins`). On **clear**, it **removes only those keys** and leaves the rest of the object intact—so extra fields you add keep round-tripping. (On a stock repo, clear can leave **`{}`**; run fills the managed keys back in.)
- **`.claude-plugin/marketplace.json`:** this file is the **generated listing** for the local Clankgsters marketplace: sync **rewrites** it from what it discovers under **`.clank/`**. Treat **`.clank/`** as the source of truth for that listing; do not rely on hand-editing this JSON as a permanent side channel—edit plugins in `.clank/` and re-run sync.

**Idempotent (we checked the receipts):** from the repo root we ran **`clankgsters-sync:clear`**, captured a full file list plus **SHA-256** hashes for every file under **`.claude/`**, **`.claude-plugin/`**, and **`.cursor/`**, then ran **`clankgsters-sync:run`** and captured again. We ran **clear** a second time: the snapshot matched the **first clear byte-for-byte** (same paths, same hashes). We ran **run** again: snapshot matched the **first run** the same way. So: **`clear → clear`** and **`run → run`** are stable on this tree—nothing mysteriously drifted or got “cleaned up” extra.

**Bottom line:** a lot of care went into **not** treating your agent directories as disposable scratch space. Sync adds and removes the **Clankgsters-managed** surfaces; **your** context files are expected to live next to them, season after season.

## Licensing

This package is intended to be practical to adopt in open-source and enterprise projects.

- The published npm artifact for `@clankgsters/sync` is licensed under MIT (see `LICENSE` in this package).
- Repository source in the monorepo follows the PolyForm Noncommercial License 1.0.0 (see the root `LICENSE`).
- The npm artifact currently includes `src/` and `scripts/` for typing and CLI developer experience, and those shipped files are covered by the package MIT license.
- This structure keeps installed package usage simple while keeping source-sharing expectations explicit.
