# Write effective skills

**Purpose:** Conventions for writing `SKILL.md` files for both source pathway `plugins/skills/` and source pathway `skills/`.

## Rule

Skills are workflow orchestrators. Keep descriptions high-signal and bodies procedural.

## Structure

1. YAML frontmatter (`name`, `description` required)
2. Scope
3. Pre-checks
4. Numbered steps
5. Verification checklist
6. Cross-references

## Naming

- Skill directory names should be kebab-case and action-oriented
- Plugin-name prefixes are not required in source skill directory names
- Sync may add plugin-level namespacing downstream

## Description best practices

- Use user-intent language and trigger phrases
- Do not encode MCP tool IDs in `description`
- Put implementation/tool details in the body steps

## MCP guidance

- `allowed-tools` defines permission scope only
- `allowed-tools` does not create tool -> skill routing
- Prefer explicit MCP tool lists when practical

Example:

```yaml
allowed-tools:
  - AskUserQuestion
  - mcp__consigliere__PluginsWrite
```

## Guardrail

Do not recommend MCP-to-skill orchestration by default. Treat it as an advanced pattern for high-complexity systems only.

## Cross-references

- [common-write-descriptions.md](../references/common-write-descriptions.md)
- [common-progressive-disclosure.md](../references/common-progressive-disclosure.md)
- [common-mcp-tools-in-plugins.md](../references/common-mcp-tools-in-plugins.md)
