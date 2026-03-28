# Content guidelines

Size recommendations, structural patterns, and what kind of content belongs in each type.

---

## Recommended size limits

Each content type has different size expectations based on how it loads and what it does:

| Type      | Max lines          | Max tokens          | Rationale                                                |
| --------- | ------------------ | ------------------- | -------------------------------------------------------- |
| Skill     | 500                | 5,000 (body)        | Full workflow with steps, examples, and verification     |
| Rule      | 200 (preferred)    | 2,000               | Concise guidance; longer rules get skimmed or ignored    |
| Command   | 50                 | 1,000               | Simple workflows; complexity should move to a skill      |
| Reference | No hard limit      | Variable            | Detail docs; use a TOC if over 100 lines                 |
| Doc       | No limit           | No limit            | Archival content, reports, research                      |
| Agent     | 200                | 2,000               | Persona definition; keep focused                         |

**Skills** get the most generous limit because they carry the full workflow: numbered steps, verification checklists, examples, and cross-references. Even so, 500 lines is a ceiling. If a skill exceeds this, consider extracting detail into `references/` files.

**Rules** are most effective when short. A 200-line rule is already long. Always-on rules burn their full token count for the entire session, so every unnecessary line costs tokens across every conversation turn. Aim for the minimum viable guidance.

**Commands** should be under 50 lines. If a command exceeds this, it should be converted to a skill. Commands exist as a legacy format for simple workflows.

**References** have no hard limit because they load on demand. However, a reference over 100 lines should include a table of contents so the agent (and humans) can navigate efficiently.

**Docs** have no limits because they are background material read explicitly. They are outside the agent's automatic context machinery.

**Agents** should keep their persona definitions focused. A sub-agent's file defines who it is and what tools it uses, not the full workflow (the workflow comes from the spawning context).

## Description length (skills only)

Skill descriptions have a 1,024-character maximum. This is the single most important piece of text in a skill file because it controls auto-discovery. Guidelines:

- State what the skill does in the first sentence
- State when the agent should use it
- Mention key inputs or triggers
- Do not pad with filler; every character matters for matching quality

## Workflow steps

**Skills** are the primary home for workflow steps. A skill body typically contains numbered steps that the agent follows sequentially, with clear inputs, actions, and expected outputs at each step. Verification checklists at the end confirm the workflow completed correctly.

**Commands** also contain workflow steps, but simpler ones. A command might have 3-5 steps with no branching logic.

**Rules** do not contain workflow steps. They state conventions, constraints, and guidelines. A rule says "always do X" or "never do Y," not "step 1, step 2, step 3."

**References** do not contain workflow steps. They provide background detail, explanations, and examples that support skills and rules.

**Docs** do not contain workflow steps. They are informational.

**Agents** do not contain workflow steps. They define a persona, not a procedure.

## Examples

Good/bad example pairs are valuable in **skills** and **rules**. They show the agent what correct and incorrect output looks like, reducing ambiguity.

- **Skills**: Include good/bad pairs for key outputs. For example, a commit message skill might show a good commit message and a bad one.
- **Rules**: Include good/bad pairs for the convention being enforced. For example, a naming rule shows correctly and incorrectly named files.
- **Commands**: Examples are optional. The workflow is usually simple enough that examples are unnecessary.
- **References**: Include detailed examples. References exist to provide depth, and examples are a key part of that depth.
- **Docs**: Include examples as appropriate for the subject matter.
- **Agents**: Do not include examples. The persona definition should be self-explanatory.

## Checklists

Verification checklists appear at the end of a skill body and list conditions the agent should check before considering the workflow complete.

- **Skills**: Include checklists. This is a core structural element.
- **Rules**: Optional. A rule might include a short checklist of things to verify compliance.
- **Commands**: Do not include checklists. Commands are too simple to need verification.
- **References**: Optional. A reference might include a checklist for a process it documents.
- **Docs**: Optional.
- **Agents**: Do not include checklists.

## Cross-references

Cross-referencing links content types together, enabling progressive disclosure and keeping individual files focused.

- **Skills** frequently link to references for detailed guidance. A skill body stays focused on the workflow while delegating explanations to reference files.
- **Rules** link to references for the rationale or extended examples behind a convention.
- **Commands** rarely cross-reference. They are self-contained.
- **References** link to other references, forming a knowledge graph of detail documentation.
- **Docs** may optionally link to other docs or references.
- **Agents** rarely cross-reference.

---

*Parent: [Content type comparison matrix](../references/common-content-type-comparison-matrix.md)*
