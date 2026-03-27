# MCP tools in plugins

How to use plugin-provided MCP tools without over-indexing on complexity.

## Default recommendation

For most plugins, do **not** implement MCP-to-skill orchestration. Prefer direct skills and simple workflows.

This pattern is recommended only for complex edge cases where you need explicit routing, shared contracts, and multi-skill orchestration.

## Platform reality

- There is no automatic tool -> skill mapping in skill frontmatter.
- `allowed-tools` controls permission scope, not dispatch or routing.
- If you need deterministic routing, implement it explicitly in server code.

## When to use MCP routing contracts

- You need structured parameters across repeated workflows.
- You need predictable action chaining (`audit` -> `update`).
- You need one canonical route registry shared across many skills.

## When not to use MCP routing contracts

- Simple one-off content updates.
- Short workflows where a single skill can execute directly.
- Teams where maintainability matters more than orchestration sophistication.

## Minimal shape

- Add `.mcp.json` at plugin root.
- Point to a local MCP server command.
- Define a canonical route table in docs and code.
- Reference tools in skill frontmatter only when needed.

## Consigliere-specific implementation

- Canonical spec: [common-internal-mcp-routing-spec.md](../docs/common-internal-mcp-routing-spec.md)
- Server implementation: [`servers/consigliere-mcp-server.js`](../servers/consigliere-mcp-server.js)

## References

- [Claude plugins docs](https://code.claude.com/docs/en/plugins)
- [Claude MCP docs](https://code.claude.com/docs/en/mcp)
- [Claude skills docs](https://code.claude.com/docs/en/skills)
- [MCP tools spec](https://modelcontextprotocol.io/specification/latest/server/tools)
