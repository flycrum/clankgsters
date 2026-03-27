# Content type comparison matrix

## Pathway comparison

| Dimension | source pathway `plugins/` | source pathway `skills/` | source pathway `CLANK.md` |
| --- | --- | --- | --- |
| Granularity | Collection of files | Single skill folder | Single markdown file |
| Best for | Related systems of guidance | One reusable workflow | Critical global preload |
| Idle context cost | Mostly rules/descriptions | Skill descriptions | Entire file |
| Typical actions | write/update/remove/audit | write/update/remove/audit | write/update/remove/audit |
| MCP suitability | High | Medium | Medium |

## Plugin content-type matrix

| Type | Purpose | Auto-loaded | Typical size |
| --- | --- | --- | --- |
| Skill | Workflow | Description only | Medium |
| Rule | Convention | Yes/conditional by platform | Small |
| Reference | Shared detail | No (on-demand via links) | Medium-large |
| Doc | Background | No | Any |
| Agent | Sub-agent persona | On spawn | Medium |

## Details docs

- [plugins-matrix-loading-behavior.md](plugins-matrix-loading-behavior.md)
- [plugins-matrix-invocation-triggering.md](plugins-matrix-invocation-triggering.md)
- [plugins-matrix-metadata-frontmatter.md](plugins-matrix-metadata-frontmatter.md)
- [plugins-matrix-content-guidelines.md](plugins-matrix-content-guidelines.md)
- [plugins-matrix-naming-organization.md](plugins-matrix-naming-organization.md)
- [plugins-matrix-cross-agent-support.md](plugins-matrix-cross-agent-support.md)
