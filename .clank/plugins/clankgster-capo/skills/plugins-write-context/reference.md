# Reference hub: plugin content authoring

Canonical quick-reference for writing source pathway `plugins/` content.

## Read order

1. [common-content-type-decision-tree.md](../../references/common-content-type-decision-tree.md)
2. [common-content-type-comparison-matrix.md](../../references/common-content-type-comparison-matrix.md)
3. [common-organizing-content.md](../../rules/common-organizing-content.md)
4. [common-write-rules.md](../../rules/common-write-rules.md)

## Skills in plugins

Plugin `skills/<name>/SKILL.md` files share structure and frontmatter conventions with standalone source pathway `skills/`. For SKILL.md-specific authoring depth, use:

- [skills-write-context/reference.md](../skills-write-context/reference.md)

Plugin skills differ from standalone skills mainly by where they live, namespaced invocation behavior, and the fact that they are coordinated with sibling plugin content types (`rules/`, `references/`, `docs/`, `agents/`, `hooks/`).

## Other plugin content types

- Rules: [rule-template.md](docs/rule-template.md)
- References: [common-progressive-disclosure.md](../../references/common-progressive-disclosure.md)
- Docs: matrix detail index and `docs/plugins-matrix-*.md` links in [common-content-type-comparison-matrix.md](../../references/common-content-type-comparison-matrix.md)
- Commands: [command-template.md](docs/command-template.md)
- Agents: [agent-template.md](docs/agent-template.md)
- Hooks: [hooks-template.md](docs/hooks-template.md)
