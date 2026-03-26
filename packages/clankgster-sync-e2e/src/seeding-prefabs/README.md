# Seeding prefabs

This folder contains the e2e sandbox seeding system.

- `prefabs/*-seeding-prefab.ts` contains one concrete class per seeding prefab
- `blueprints/*-seeding-blueprint.ts` composes one or more seeding prefabs
- `seeding-prefab-orchestration.ts` resolves prepare metadata (`append` / `replace`) and executes runs
- `seeding-prefabs.ts` exposes grouped registries and the seeding API object

Use in test cases:

```ts
import { DefaultSandboxSeedingBlueprint } from '../../seeding-prefabs/blueprints/default-sandbox-seeding-blueprint.js';

seeding: e2eTestCase.defineSeeding([new DefaultSandboxSeedingBlueprint('', {})]);
```
