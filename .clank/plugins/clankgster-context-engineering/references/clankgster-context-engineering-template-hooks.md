# Template: hooks file

Annotated template for writing `hooks/hooks.json` in `.clank/plugins/<plugin>/hooks/`. Hooks are event-driven automations — deterministic code triggered by lifecycle events, not AI instructions. They run shell commands, prompt evaluations, or agent verifiers at specific points during a session.

## Template: hooks.json

```json
// WHY: hooks.json maps lifecycle events to handler arrays. Each handler
// fires when the event occurs. Multiple handlers per event run in order.
{
  // WHY: SessionStart runs once when the agent session begins.
  // Use for environment setup, log initialization, context seeding.
  "SessionStart": [
    {
      // WHY: "command" handlers run shell scripts. They are deterministic
      // and do not consume AI tokens. Prefer for validation and setup.
      "type": "command",
      "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/on-session-start.sh"
    }
  ],

  // WHY: PreToolUse fires before every tool call. Use to validate arguments,
  // block dangerous operations, or inject context. The "matcher" field
  // filters which tools trigger this hook.
  "PreToolUse": [
    {
      "type": "command",
      "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/pre-tool-check.sh",
      // WHY: matcher restricts the hook to specific tools. Without it,
      // the hook fires on every tool call (expensive).
      "matcher": "Bash"
    }
  ],

  // WHY: PostToolUse fires after a tool call completes. Use for logging,
  // metrics, or follow-up validation.
  "PostToolUse": [
    {
      "type": "command",
      "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/post-tool-log.sh",
      "matcher": "Write"
    }
  ],

  // WHY: Stop fires when the agent is about to end its turn. Use for
  // cleanup, summary generation, or final validation.
  "Stop": [
    {
      // WHY: "prompt" handlers send text to the LLM for evaluation.
      // Use when the check requires judgment, not just shell logic.
      "type": "prompt",
      "prompt": "Review the changes made in this session. Flag any files that were modified but not tested."
    }
  ]
}
```

## Event reference

<!-- WHY: This table lists all available events so authors do not need to
     look up the docs. Grouped by lifecycle phase. -->

| Event | When it fires | Common use |
| --- | --- | --- |
| `SessionStart` | Session begins | Environment setup, log init |
| `SessionEnd` | Session ends | Cleanup, summary |
| `UserPromptSubmit` | User sends a message | Input validation, context injection |
| `PreToolUse` | Before a tool call | Argument validation, blocking |
| `PostToolUse` | After a tool call succeeds | Logging, follow-up checks |
| `PostToolUseFailure` | After a tool call fails | Error handling, retry logic |
| `SubagentStart` | Sub-agent spawns | Resource tracking |
| `SubagentStop` | Sub-agent finishes | Result aggregation |
| `Stop` | Agent turn ends | Final validation, cleanup |
| `PreCompact` | Before context compaction | Save critical state |
| `Notification` | System notification | Alerting |
| `InstructionsLoaded` | Rules/instructions load | Dynamic config |
| `TaskCompleted` | Task finishes | Metrics, next-step prompts |

## Handler types

| Type | Runs | Token cost | Use when |
| --- | --- | --- | --- |
| `command` | Shell script | None | Deterministic validation, file I/O, logging |
| `prompt` | LLM evaluation | Yes | Judgment-based checks, summaries |
| `agent` | Agentic verifier with tools | Yes (high) | Multi-step verification requiring tool access |

## Example hook script

```bash
#!/usr/bin/env bash
# hooks/on-session-start.sh
# WHY: Verify required tools are available before the session proceeds.
# Exit non-zero to signal failure to the hook system.

set -euo pipefail

command -v node >/dev/null 2>&1 || { echo "node is required"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "pnpm is required"; exit 1; }

echo "Environment check passed"
```

## Checklist

- [ ] `hooks.json` is valid JSON (no trailing commas, no comments in production)
- [ ] Each event maps to an array of handler objects
- [ ] `command` handlers use `${CLAUDE_PLUGIN_ROOT}` for portable paths
- [ ] `matcher` is set on PreToolUse/PostToolUse to avoid firing on every tool call
- [ ] Hook scripts are executable (`chmod +x`)
- [ ] Scripts use `set -euo pipefail` and exit non-zero on failure
- [ ] `prompt` and `agent` types are used sparingly (they consume tokens)
- [ ] File lives at `hooks/hooks.json` in plugin root
