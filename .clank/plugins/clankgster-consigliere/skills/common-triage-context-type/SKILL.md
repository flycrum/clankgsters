---
name: common-triage-context-type
description: >-
  Triages new context requests across Clankgster source pathways (`plugins/`,
  `skills/`, `CLANK.md`) and dispatches to pathway-specific MCP routes. Use when
  users ask where context should live, what to create first, or how to start a
  new context artifact.
allowed-tools:
  - AskUserQuestion
  - mcp__consigliere__Triage
  - mcp__consigliere__PluginsWrite
  - mcp__consigliere__SkillsWrite
  - mcp__consigliere__ClankMdWrite
---

# Triage context type

## Scope

Choose a source pathway, explain why, and dispatch to the appropriate MCP route.

## Steps

1. Present four options with AskUserQuestion:
   - analyze and recommend
   - source pathway `skills/`
   - source pathway `plugins/`
   - source pathway `CLANK.md`
2. If analyze and recommend is selected, inspect user intent and map to one pathway.
3. Confirm pathway choice in one sentence.
4. Call the matching MCP tool:
   - If analyze and recommend is selected, call `Triage`.
   - If source pathway `skills/` is selected, call `SkillsWrite`.
   - If source pathway `plugins/` is selected, call `PluginsWrite`.
   - If source pathway `CLANK.md` is selected, call `ClankMdWrite`.
5. Return the selected pathway and routed next action.

## Verification

- [ ] Exactly one pathway selected
- [ ] Reasoning included for analyze and recommend selection
- [ ] MCP route dispatch call made for selected pathway
