# MCP tools in plugins

How to use plugin-provided MCP tools without over-indexing on complexity.

## When to use MCP

- You need structured parameters across repeated workflows
- You want predictable action chaining (`auditing` -> `updating`)
- You need tool-level reuse across multiple skills

## When not to use MCP

- Simple one-off content updates
- Short workflows that skills can handle directly
- Situations where tool setup cost outweighs benefit

## Minimal shape

- Add `.mcp.json` at plugin root
- Point to a local MCP server command
- Reference tools in skill frontmatter via `allowed-tools`

## Tool naming guidance

- Keep names short and pathway/action oriented
- Prefer explicit pairs like `PluginsWriting`, `SkillsRemoving`, `ClankMdAuditing`
- Keep one namespace/server per plugin where possible

## References

- [Claude plugins docs](https://code.claude.com/docs/en/plugins)
- [Claude MCP docs](https://code.claude.com/docs/en/mcp)
- [Claude skills docs](https://code.claude.com/docs/en/skills#restrict-tool-access)

