# E2E prefabs and presets

Dynamic seeding for e2e sandboxes.

- Prefabs are class instances that create one or more files/dirs in a case sandbox
- Presets are class instances that expand into ordered prefab lists
- Both use constructor signature: `(sandboxDirectoryName, options)`
- `PrefabBase` exposes protected fs/path helpers so subclasses stay focused on scenario intent

Use exports from `scripts/prefabs/prefabs.ts`.

Example:

```ts
seeding: e2eTestCase.definePrefabs([
  new PluginsSkillsScenarioPreset('sandbox-template', { scenarioMode: 'root-only' }),
  new MarkdownContextScenarioPreset('sandbox-template', { scenarioMode: 'root-and-nested-1' }),
]);
```
