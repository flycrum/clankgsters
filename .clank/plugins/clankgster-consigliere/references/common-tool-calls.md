# Tool calls reference for AI coding agents

Reference of known tools across Claude Code, Cursor, and Codex. Use this when writing skills or rules that need to request specific tools.

---

## Table of contents

1. [Claude Code tools](#claude-code-tools)
2. [Cursor tools](#cursor-tools)
3. [Codex tools](#codex-tools)
4. [Cross-platform patterns](#cross-platform-patterns)
5. [Requesting tools in skills](#requesting-tools-in-skills)
6. [Permission syntax](#permission-syntax)

---

## Claude Code tools

### File operations

| Tool | Purpose | Needs permission |
| ------ | --------- | ----------------- |
| `Read` | Read file contents, images, PDFs, notebooks | No |
| `Write` | Create or overwrite files | Yes |
| `Edit` | Targeted string replacement in files | Yes |
| `Glob` | Find files by glob pattern (e.g. **`/*.ts`) | No |
| `Grep` | Search file contents with regex | No |
| `NotebookEdit` | Modify Jupyter notebook cells | Yes |

### Shell and execution

| Tool | Purpose | Needs permission |
| ------ | --------- | ----------------- |
| `Bash` | Execute shell commands | Yes |
| `PowerShell` | PowerShell commands (Windows, opt-in) | Yes |

### Agent and task management

| Tool | Purpose | Needs permission |
| ------ | --------- | ----------------- |
| `Agent` | Spawn a sub-agent with isolated context | No |
| `TaskCreate` | Create a background task | No |
| `TaskGet` | Get task status and details | No |
| `TaskList` | List all tasks | No |
| `TaskUpdate` | Update task status or details | No |
| `TaskStop` | Stop a running task | No |
| `TodoWrite` | Manage session task checklist | No |

### User interaction

| Tool | Purpose | Needs permission |
| ------ | --------- | ----------------- |
| `AskUserQuestion` | Ask the user a question with options | No |
| `Skill` | Invoke another skill | Yes |

### Web and search

| Tool | Purpose | Needs permission |
| ------ | --------- | ----------------- |
| `WebFetch` | Fetch URL content | Yes |
| `WebSearch` | Perform web search | Yes |
| `ToolSearch` | Search for deferred/available tools | No |

### Planning and workflow

| Tool | Purpose | Needs permission |
| ------ | --------- | ----------------- |
| `EnterPlanMode` | Switch to plan mode | No |
| `ExitPlanMode` | Present plan and exit plan mode | Yes |
| `EnterWorktree` | Create an isolated git worktree | No |
| `ExitWorktree` | Exit worktree session | No |

### Scheduling

| Tool | Purpose | Needs permission |
| ------ | --------- | ----------------- |
| `CronCreate` | Schedule recurring/one-shot prompts | No |
| `CronDelete` | Cancel a scheduled task | No |
| `CronList` | List scheduled tasks | No |
| `RemoteTrigger` | Trigger a remote agent run | No |

### Code intelligence

| Tool | Purpose | Needs permission |
| ------ | --------- | ----------------- |
| `LSP` | Language Server Protocol operations | No |
| `ListMcpResourcesTool` | List MCP server resources | No |
| `ReadMcpResourceTool` | Read MCP resource by URI | No |

### Agent sub-types (for Agent tool)

| Type | Purpose |
| ------ | --------- |
| `general-purpose` | Default; multi-step tasks, research, code execution |
| `Explore` | Fast codebase exploration (glob, grep, read — no edits) |
| `Plan` | Architectural design; returns implementation plans |

---

## Cursor tools

Cursor does not publish a fixed tool list. Its agent works through these capability areas:

| Capability | Description |
| ------------ | ------------- |
| File read/write/edit | Read, create, and modify files |
| Terminal execution | Run shell commands in the integrated terminal |
| Codebase search | Semantic search across indexed codebase |
| Web search | Search the web for context |
| MCP tools | Extensible via 30+ partner MCP plugins |
| Rule application | Auto-apply `.mdc` rules based on globs or description |

### Cursor-specific features

- **Apply to file** — Cursor can apply changes to specific files based on glob patterns in `.mdc` frontmatter
- **Codebase indexing** — Cursor indexes the full codebase for semantic search, not just file-level
- **Context mentions** — Users can `@mention` files, folders, docs, web pages to inject context

---

## Codex tools

Codex CLI exposes these capabilities:

| Capability | Description |
| ------------ | ------------- |
| File operations | Read, write, edit, and patch files |
| Shell execution | Run commands in a sandboxed environment |
| Web search | Search the web for information |
| MCP tools | Extensible via agents SDK MCP integration |
| Skill invocation | Built-in slash commands (`/review`, `/fork`, etc.) |

### Codex-specific features

- **Sandboxed execution** — All file operations run in a sandbox by default
- **AGENTS.md hierarchy** — Codex reads the nearest AGENTS.md to the edited file for context
- **Approval modes** — `suggest` (human approves), `auto-edit` (auto-approve edits), `full-auto` (auto-approve all)

---

## Cross-platform patterns

### File operation patterns

| Action | Claude Code | Cursor | Codex |
| -------- | ------------- | -------- | ------- |
| Read a file | `Read` tool | File read | File read |
| Create/overwrite file | `Write` tool | File create | File write |
| Edit existing file | `Edit` tool | File edit | File patch |
| Find files by name | `Glob` tool | Codebase search | File search |
| Search file contents | `Grep` tool | Codebase search | File search |

### User interaction patterns

| Action | Claude Code | Cursor | Codex |
| -------- | ------------- | -------- | ------- |
| Ask user a question | `AskUserQuestion` | Ask question | Ask mode |
| Present options | `AskUserQuestion` (with options) | Suggest options | Ask mode |

### Execution patterns

| Action | Claude Code | Cursor | Codex |
| -------- | ------------- | -------- | ------- |
| Run shell command | `Bash` tool | Terminal | Shell |
| Run in background | `Bash` (run_in_background) | Background terminal | Background |

---

## Requesting tools in skills

When writing skills, name tools explicitly to guide the agent.

### Direct tool requests

```markdown
Use the Read tool to read the configuration file.
Use the Glob tool to find all SKILL.md files under .clank/plugins/.
Use the Grep tool to search for the function definition.
Use the Agent tool with subagent_type "Explore" to search the codebase.
```

### Avoid vague references

<examples>
<example type="good">
Search for files matching **`/*.test.ts` using the Glob tool.
</example>
<example type="bad">
Find the test files somehow.
</example>
</examples>

### Parallel tool calls

When multiple independent operations are needed, tell the agent to parallelize:

```markdown
Read both files in parallel:
- Use the Read tool to read `src/config.ts`
- Use the Read tool to read `src/types.ts`
```

### Sequential dependencies

When tools depend on previous results, make the dependency explicit:

```markdown
1. Use the Glob tool to find all plugin.json files
2. For each file found in step 1, use the Read tool to read its contents
```

---

## Permission syntax

In Claude Code SKILL.md frontmatter, the `allowed-tools` field grants specific tool permissions during skill execution.

### Format

```yaml
allowed-tools:
  - Read
  - Edit
  - "Bash(npm:*)"
  - "Bash(git:*)"
  - "Skill(clankgster-sync:*)"
```

### Patterns

| Pattern | Matches |
| --------- | --------- |
| `Read` | Exact tool name |
| `Bash(npm:*)` | Bash commands starting with `npm` |
| `Bash(git:*)` | Bash commands starting with `git` |
| `Skill(name)` | Exact skill name |
| `Skill(name *)` | Skill name prefix match |

### Guidelines

- Only grant permissions the skill workflow actually needs
- Prefer specific patterns (`Bash(npm:*)`) over broad access (`Bash`)
- Omit `allowed-tools` entirely if the skill does not need elevated permissions

### MCP permission patterns

Use MCP permission names in the form:

- `mcp__<server>__<tool>` for a specific tool
- `mcp__<server>__*` for wildcard server access

Examples:

```yaml
allowed-tools:
  - AskUserQuestion
  - mcp__consigliere__PluginsWrite
```

```yaml
allowed-tools: mcp__consigliere__*
```

Prefer explicit tool names for sensitive or high-impact skills. Use wildcard access only when the skill genuinely needs many tools from the same server.

Important: these permission entries scope tool access only. They do not create automatic tool -> skill routing.
