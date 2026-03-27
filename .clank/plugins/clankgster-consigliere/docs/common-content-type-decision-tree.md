# Content type decision tree

Use this in two stages: pathway selection first, then content type selection.

## Pathway decision

```md
START: You have context content to add.
|
+- Is it a single standalone workflow?
|  |
|  +- YES -> source pathway `skills/`
|  +- NO -> continue
|
+- Must it preload in every session as global guidance?
|  |
|  +- YES -> source pathway `CLANK.md`
|  +- NO -> source pathway `plugins/`
```

## Plugin content-type decision

If pathway is `plugins/`, choose file type:

- convention -> `rules/`
- workflow -> `skills/`
- shared depth -> `references/`
- background docs -> `docs/`
- persona -> `agents/`
- deterministic automation -> `hooks/`

## Edge cases

- convention + workflow: create both rule and skill
- too large guidance: split and move detail to references/docs
- temporary experiments: place in docs until validated

## Quick reference

| Type | Signal | Location |
| --- | --- | --- |
| Skill | Multi-step workflow | `skills/<name>/SKILL.md` |
| Rule | Convention | `rules/<name>.md` |
| Reference | Shared detail | `references/<name>.md` |
| Doc | Background material | `docs/<name>.md` |
