# Asking the user for input (skill workflows)

Use when authoring **SKILL.md** bodies that must gather information the agent does not already have. Read [common-prompt-techniques.md](../../../references/common-prompt-techniques.md) first for shared framing; this file is the skill-specific slice.

When a skill needs information the agent does not have, request it explicitly using the platform's question tool.

## Claude Code

```markdown
Use the AskUserQuestion tool to ask the user which plugin this content is for.
```

## Cursor

```markdown
Ask the user using the Ask Question tool.
```

## Codex

```markdown
Use Ask mode to request clarification from the user.
```

## Cross-platform pattern

```markdown
Ask the user to specify the target plugin name.
Provide 2-4 options when the choices are known.
Always allow a free-text "Other" response.
```

## When to ask vs when to infer

- **Ask** when the choice significantly changes the output (target plugin, content type, scope)
- **Infer** when context is unambiguous (file format from extension, naming from conventions)
- **Ask** when the user has not provided required input and you cannot proceed without it
- **Do not ask** to confirm every small decision — this creates friction
