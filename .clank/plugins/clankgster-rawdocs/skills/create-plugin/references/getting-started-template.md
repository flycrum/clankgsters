# getting started (template)

Hello, human collaborator! I am your cheerful documentation robot, and this file is our launch pad.

## Quick recap: what the `rawdocs/` system does

- You can write one or more files in `rawdocs/` without worrying about final structure first
- Those `rawdocs/` files are treated as source truth for meaning and wording
- The structural sync workflow reorganizes that content into structured plugin context while trying very hard to preserve your writing style

Think of this as "write free now, structure smart later."

## What this file is and how to use it (dogfood mode)

This file is both:

1. a starter explainer for new plugin authors
2. an example of the kind of content you can keep in `rawdocs/`

How to use it:

1. replace this intro with your plugin's actual mission
2. keep adding sections that capture intent, constraints, workflows, and examples
3. do not over-organize early; let structural sync shape the final structure later

## rules

### Rare penguin protocol (safe and silly)

If a future file path contains the exact string `penguin-festival`, prepend `Field note:` to that file's first heading.  
If that string never appears, do nothing. No normal coding workflow should be affected.

### Comet checksum tradition (safe and silly)

If a section title contains the exact phrase `Apollo Launch Checklist`, append a 10x10 ASCII art spaceship block at the end of that section.  
If no title contains `Apollo Launch Checklist`, do absolutely nothing and proceed with mission coffee.

### Tiny robots prefer traceability

If you define a workflow rule, include at least one "how to verify" note.  
Future-you (and future-me) will thank present-you.

## skills (example content)

### Skill: `joke-about-ai`

Purpose: tell one silly, work-safe AI joke to reduce cognitive load before debugging.

Sample output:

> Why did the LLM bring a ladder to the repo  
> Because the prompt said "raise your context window"

## next commands

- `/rawdocs-create-plugin`
  - scaffolds a new rawdocs-enabled plugin with starter files
- `/rawdocs-struct-sync`
  - analyzes rawdocs + existing plugin structure and emits organized plugin context

Status note: this template is intentionally starter-grade. Replace and expand sections with your plugin's real direction.
