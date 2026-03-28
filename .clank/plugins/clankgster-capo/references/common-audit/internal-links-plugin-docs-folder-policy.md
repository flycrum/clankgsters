# Plugins audit: `docs/` folder linking policy

Use with **plugins-audit-internal-links** only. Standalone source pathway `skills/` and `CLANK.md` use different layouts.

Canonical rules and rationale: [common-plugin-docs-folder-linking.md](../common-plugin-docs-folder-linking.md)

## Verification

- [ ] Every navigational relative link to `pluginRoot/docs/` from outside `docs/` is either exempt in that document or listed as a **`docs/` target policy** finding
- [ ] Exemptions are not broadened beyond [common-plugin-docs-folder-linking.md](../common-plugin-docs-folder-linking.md) without updating organizing rules and the decision tree
