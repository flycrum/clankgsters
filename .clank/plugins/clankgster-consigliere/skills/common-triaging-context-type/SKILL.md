---
name: common-triaging-context-type
description: >-
  Triages new context requests across Clankgster source pathways (`plugins/`,
  `skills/`, `CLANK.md`) and routes to pathway-specific writing tools. Use when
  users ask where context should live, what to create first, or how to start a
  new context artifact.
allowed-tools: mcp__consigliere__*
---

# Triaging context type

## Scope

Choose a source pathway, explain why, and trigger a pathway-specific MCP writing tool.

## Steps

1. Present four options with AskQuestion:
   - analyze and recommend
   - source pathway `skills/`
   - source pathway `plugins/`
   - source pathway `CLANK.md`
2. If analyze and recommend is selected, inspect user intent and map to one pathway.
3. Confirm pathway choice in one sentence.
4. Call the matching MCP tool:
   - If analyze and recommend is selected, call `Triaging`.
   - If source pathway `skills/` is selected, call `SkillsWriting`.
   - If source pathway `plugins/` is selected, call `PluginsWriting`.
   - If source pathway `CLANK.md` is selected, call `ClankMdWriting`.
5. Return the selected pathway and next action.

## Verification

- [ ] Exactly one pathway selected
- [ ] Reasoning included for analyze and recommend selection
- [ ] MCP tool call made for selected pathway
