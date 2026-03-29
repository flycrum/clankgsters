# Create effective skills

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

Omit `## Pre-checks` when there are no step-zero gates beyond what the numbered steps already cover (common in this plugin). Remove/update skills may use `## Steps` immediately after `## Scope` when Scope is a single pathway line.

## Description best practices

- Use user-intent language and trigger phrases
- Do not encode MCP tool IDs in `description`
- Put implementation/tool details in the body steps

## MCP guidance

- `allowed-tools` defines permission scope only
- `allowed-tools` does not create tool -> skill routing
- Prefer explicit MCP tool lists when practical
- For capo: do not treat MCP as the default way to chain skills in-session — see [common_internal-in-session-vs-mcp-policy.md](../references/common_internal-in-session-vs-mcp-policy.md)

Example:

```yaml
allowed-tools:
  - AskUserQuestion
  - mcp__capo__PluginsCreate
```

## Guardrail

Do not recommend MCP-to-skill orchestration by default. Treat it as an advanced pattern for high-complexity systems only.

