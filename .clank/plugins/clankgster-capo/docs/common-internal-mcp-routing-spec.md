# MCP routing spec (internal)

Canonical explicit routing contract for `clankgster-capo` (aka `.clank/plugins/clankgster-capo`).

This is an advanced, edge-case pattern for complex orchestration. It is not the default recommendation for typical plugin authoring.

## Contract version

- `contractVersion`: `1.0.0`

## Route table

| Route ID | MCP tool | Target skill ID | Pathway | Action |
| --- | --- | --- | --- | --- |
| `common.triage` | `Triage` | `common-triage-context-type` | `common` | `triage` |
| `plugins.write` | `PluginsWrite` | `plugins-write-context` | `plugins` | `write` |
| `plugins.update` | `PluginsUpdate` | `plugins-update-context` | `plugins` | `update` |
| `plugins.remove` | `PluginsRemove` | `plugins-remove-context` | `plugins` | `remove` |
| `plugins.audit` | `PluginsAudit` | `plugins-audit-full-suite-plugin` | `plugins` | `audit` |
| `plugins.audit.contentQuality` | `PluginsAuditContentQuality` | `plugins-audit-content-quality` | `plugins` | `audit` |
| `plugins.audit.externalLinks` | `PluginsAuditExternalLinks` | `plugins-audit-external-links` | `plugins` | `audit` |
| `plugins.audit.factCheck` | `PluginsAuditFactCheck` | `plugins-audit-fact-check` | `plugins` | `audit` |
| `plugins.audit.internalLinks` | `PluginsAuditInternalLinks` | `plugins-audit-internal-links` | `plugins` | `audit` |
| `plugins.audit.sourceFreshness` | `PluginsAuditSourceFreshness` | `plugins-audit-source-freshness` | `plugins` | `audit` |
| `plugins.audit.comparisonMatrix` | `PluginsAuditComparisonMatrix` | `plugins-audit-comparison-matrix` | `plugins` | `audit` |
| `plugins.audit.structure` | `PluginsAuditStructure` | `plugins-audit-structure` | `plugins` | `audit` |
| `skills.write` | `SkillsWrite` | `skills-write-context` | `skills` | `write` |
| `skills.update` | `SkillsUpdate` | `skills-update-context` | `skills` | `update` |
| `skills.remove` | `SkillsRemove` | `skills-remove-context` | `skills` | `remove` |
| `skills.audit` | `SkillsAudit` | `skills-audit-full-suite-skill` | `skills` | `audit` |
| `skills.audit.contentQuality` | `SkillsAuditContentQuality` | `skills-audit-content-quality` | `skills` | `audit` |
| `skills.audit.externalLinks` | `SkillsAuditExternalLinks` | `skills-audit-external-links` | `skills` | `audit` |
| `skills.audit.factCheck` | `SkillsAuditFactCheck` | `skills-audit-fact-check` | `skills` | `audit` |
| `skills.audit.internalLinks` | `SkillsAuditInternalLinks` | `skills-audit-internal-links` | `skills` | `audit` |
| `skills.audit.sourceFreshness` | `SkillsAuditSourceFreshness` | `skills-audit-source-freshness` | `skills` | `audit` |
| `clankmd.write` | `ClankMdWrite` | `clankmd-write-context` | `clankmd` | `write` |
| `clankmd.update` | `ClankMdUpdate` | `clankmd-update-context` | `clankmd` | `update` |
| `clankmd.remove` | `ClankMdRemove` | `clankmd-remove-context` | `clankmd` | `remove` |
| `clankmd.audit` | `ClankMdAudit` | `clankmd-audit-full-suite-md` | `clankmd` | `audit` |
| `clankmd.audit.contentQuality` | `ClankMdAuditContentQuality` | `clankmd-audit-content-quality` | `clankmd` | `audit` |
| `clankmd.audit.externalLinks` | `ClankMdAuditExternalLinks` | `clankmd-audit-external-links` | `clankmd` | `audit` |
| `clankmd.audit.factCheck` | `ClankMdAuditFactCheck` | `clankmd-audit-fact-check` | `clankmd` | `audit` |
| `clankmd.audit.internalLinks` | `ClankMdAuditInternalLinks` | `clankmd-audit-internal-links` | `clankmd` | `audit` |
| `clankmd.audit.sourceFreshness` | `ClankMdAuditSourceFreshness` | `clankmd-audit-source-freshness` | `clankmd` | `audit` |

## Input payload shape

Most route tools accept:

```json
{
  "targetPath": "string (optional)",
  "userIntent": "string (optional)",
  "dryRun": true,
  "context": {}
}
```

`Triage` accepts pathway-selection oriented input:

```json
{
  "mode": "analyze | explicit",
  "selectedPathway": "plugins | skills | clankmd",
  "userIntent": "string (optional)",
  "context": {}
}
```

## Output payload shape

Every successful tool returns `structuredContent` with:

- `contractVersion`
- `ok`
- `routeId`
- `toolName`
- `targetSkillId`
- `pathway`
- `action`
- `input`
- `handoff.recommendedSkillCommand`
- `handoff.note`

## Error semantics

- Unknown tool: `isError: true` with error code `UNKNOWN_TOOL`
- Invalid params: JSON-RPC error `-32602` with `INVALID_TOOL_NAME`
- Unknown method: JSON-RPC error `-32601`

## Important behavior note

MCP routing metadata does not auto-execute skills. Skill execution remains explicit and model-mediated.

