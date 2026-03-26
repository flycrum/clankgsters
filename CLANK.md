# CLANK.md

## Purpose

- **Agent-agnostic root.** This file is coding-agent-agnostic context. Sync (e.g. Clankgster) can derive agent-specific entry points such as `AGENTS.md`, `CLAUDE.md`, and similar from it—one source, many surfaces.
- **Single condensed layer.** `CLANK.md` is this monorepo’s one root, condensed context and instructions file: tech stack, packages, and how AI agents should work here. It should summarize and **link** to deeper detail elsewhere, not duplicate whole docs.
- **Session preload.** The assumption is that this file is loaded near the start of a coding agent chat session. Treat it as space for **critical, mostly global** context and instructions you want **every** session to see—not a dump of everything the repo knows.

## Guidelines

- **Be prudent.** Add to `CLANK.md` only when the benefit of universal preload clearly outweighs the cost in attention and tokens.
- **Size and limits.** Codex applies a cap on injected context (on the order of tens of kilobytes). Claude and similar agents often load the whole file into the context window, so a long `CLANK.md` burns tokens fast. Keep the file short on purpose.
- **Effectiveness.** The most effective root context files tend to have on the order of **6–10 rules** and **3–5 command references**. Longer files tend to see diminishing returns—buried instructions get skipped. **Target under ~150 lines**; start around **10–15 lines** of high-signal content and grow only when something truly belongs in every session.
- **Prefer links over bulk.** For critical facts, use a **condensed one-liner** in `CLANK.md`, then point to [`.docs`](./.docs) or other markdown for procedures, rationale, and examples.
