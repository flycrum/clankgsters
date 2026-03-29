---
name: common-triage-context-type
description: >-
  Triages new context requests across Clankgster source pathways (`plugins/`,
  `skills/`, `CLANK.md`) and hands off to the matching pathway create workflow.
  Prefer reading and executing the pathway `*-create-context` skill; optional
  capo MCP tool dispatch when the host exposes tools. Use when users ask where
  context should live, what to create first, or how to start a new context
  artifact.
allowed-tools:
  - AskUserQuestion
  - mcp__capo__Triage
  - mcp__capo__PluginsCreate
  - mcp__capo__SkillsCreate
  - mcp__capo__ClankMdCreate
---

# Triage context type

## Scope

Choose a source pathway, explain why, and hand off to the appropriate create workflow.

## Steps

1. Read [reference.md](reference.md).
2. Present four options with AskUserQuestion:
   - analyze and recommend
   - source pathway `skills/`
   - source pathway `plugins/`
   - source pathway `CLANK.md`
3. If analyze and recommend is selected, inspect user intent and map to one pathway.
4. Confirm pathway choice in one sentence.
5. Hand off to the pathway create workflow:
   - **Primary (in-session):** Read and follow the full body of the matching `SKILL.md`:
     - source pathway `skills/` → [skills-create-context/SKILL.md](../skills-create-context/SKILL.md)
     - source pathway `plugins/` → [plugins-create-context/SKILL.md](../plugins-create-context/SKILL.md)
     - source pathway `CLANK.md` → [clankmd-create-context/SKILL.md](../clankmd-create-context/SKILL.md)
     - If analyze and recommend was selected, use the pathway chosen in step 3–4

   - **Optional (MCP):** If capo MCP tools are connected and the user or client expects tool dispatch, call the matching create tool: `SkillsCreate`, `PluginsCreate`, or `ClankMdCreate` per [common-internal-mcp-routing-spec.md](../../docs/common-internal-mcp-routing-spec.md). Do not self-call `Triage` from inside this skill; do not use MCP to replace the primary read-and-follow path unless the user asks for tool dispatch.

6. Return the selected pathway and what you did (skill followed and/or optional MCP call).

## Verification

- [ ] Exactly one pathway selected
- [ ] Reasoning included for analyze and recommend selection
- [ ] Primary handoff: create-context `SKILL.md` read and executed **or** optional MCP call documented when tools were used instead

