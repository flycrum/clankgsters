# Fill PR template from git diff vs parent branch

**What it does:** Detect current branch + most likely parent branch, analyze changes between parent and `HEAD`, and fill `.github/pull_request_template.md` with generated contents into a copy-ready markdown PR description for AI agents

**Usage:** `/git-pr-fillout-template` -> detect parent -> inspect diff/log/stat -> output completed markdown in a fenced code block

---

## Output contract

- Always return final PR text inside a markdown code fence
- Do not write files
- Keep phrasing terse and high-signal for AI agent reviewers
- Bullets: no trailing punctuation

---

## Steps

1. **Read template and current branch**
   - Read `.github/pull_request_template.md`
   - `git rev-parse --abbrev-ref HEAD` -> `CURRENT_BRANCH`

2. **Detect parent branch** (priority order; stop at first valid match)

   **Resolve default branch name once** (baselines + fallbacks; never assume `main` without checking):
   - `git symbolic-ref -q refs/remotes/origin/HEAD` → e.g. `refs/remotes/origin/main`; strip `refs/remotes/origin/` → `DEFAULT_BRANCH`
   - If unset or ref missing: try `git show-ref --verify --quiet refs/heads/main` → `DEFAULT_BRANCH=main`, else same for `master`, else pick first reasonable local head (e.g. `git for-each-ref --format='%(refname:short)' refs/heads | head -1`)

   a. **Reflog branch-creation signals** (highest confidence)
   - Prefer scoped reflog: `git reflog show CURRENT_BRANCH | head -50` (fall back to `git reflog show --all` only if needed)
   - Keep lines that contain the fixed substrings `branch:` or `checkout: moving from` (use `grep -F` for those literals; use `grep -F CURRENT_BRANCH` so the branch name is a fixed string, not a regex)
   - When filtering or comparing **whole lines** for an exact match, use `grep -Fx`
   - Extract candidate ref names from structured patterns (parse tokens; do not treat arbitrary substrings as refs):
     - `branch: Created from refs/heads/X` → `X`
     - `checkout: moving from X to CURRENT_BRANCH` → `X`
   - Normalize names:
     - Remove `refs/heads/` prefix when present
     - Map `origin/team/X` → `team/X` when matching local heads (strip leading remote name)
   - Validate each candidate with **exact refs** (no `git branch -a | grep CANDIDATE` substring matching):
     - Local: `git show-ref --verify --quiet "refs/heads/$CANDIDATE"`
     - Else remote-tracking: `git show-ref --verify --quiet "refs/remotes/origin/$CANDIDATE"` (after normalization), or other `refs/remotes/<remote>/$CANDIDATE` when appropriate
   - **Reachability** (explicit git outcomes, not string hacks on merge-base output):
     - Require `git merge-base HEAD "$CANDIDATE"` to exit 0 and emit a commit OID
     - When “parent must be strictly behind feature” applies, prefer `git merge-base --is-ancestor "$CANDIDATE" HEAD` in addition
   - Pick first candidate that passes validation, scanning from newest reflog entries downward

   b. **Merge-base branch tip match**
   - Baseline anchor: `git merge-base HEAD "$DEFAULT_BRANCH"` when you need a comparison tip (not a hardcoded `main`)
   - Collect branch candidates:
     - `git for-each-ref --format='%(refname:short)' refs/heads refs/remotes`
   - For each candidate not equal to `CURRENT_BRANCH`:
     - `MB=$(git merge-base HEAD "$CANDIDATE")` — must succeed (non-zero exit → skip candidate)
     - `TIP=$(git rev-parse "$CANDIDATE")` — must succeed
     - Candidate matches if `test "$MB" = "$TIP"` (OID equality; branch likely created from candidate tip)
   - If multiple matches, pick most recent by commit date:
     - `git log -1 --format=%ct "$CANDIDATE"`

   c. **Sequential naming heuristic**
   - Parse ticket-like token from branch (e.g. `MR-8088`)
   - Find nearby lower numbers with same prefix
   - Validate each with the same **tip match** rule as (b): `merge-base HEAD` and `rev-parse` OIDs must match
   - Pick nearest lower valid branch

   d. **Fallback**
   - Use `$DEFAULT_BRANCH` if that ref still validates via `show-ref` / `rev-parse`, else `master` if `refs/heads/master` exists, else first suitable local head from `refs/heads`

3. **Gather change context**
   - `git diff PARENT_BRANCH...HEAD --stat`
   - `git diff PARENT_BRANCH...HEAD --name-only`
   - `git log PARENT_BRANCH..HEAD --oneline`
   - `git diff PARENT_BRANCH...HEAD`

4. **Analyze for PR narrative**
   - Identify primary problem solved and approach used
   - Group changes by theme/component
   - Note config/flags/toggles/feature flags if present (e.g. trebuchets as internal jargon)
   - Extract testing actions from changed areas
   - Detect deploy-impacting changes (env, migrations, infra, breaking behavior)

5. **Fill template sections**
   - Use repo template section names as source of truth
   - Add prominent parent-branch banner right under summary/description:
     - `**🎯 PARENT BRANCH DETECTED: <branch> 🎯**`
   - Section guidance:
     - `Summary`: 2-3 concise sentences on problem + approach
     - `Screenshots`: `N/A` unless visual/UI behavior changed
     - `What changed`: numbered list by importance; brief sub-bullets allowed
     - `Checklist`: keep checkbox lines from template; mark `[x]` only if directly verifiable from available evidence, otherwise keep `[ ]`
     - `Notes for reviewers`: testing steps, risky areas, flags/toggles, reviewer focus
   - If no deployment concerns, mention none in reviewer notes instead of inventing

6. **Return result**
   - Output one fenced markdown block only
   - Content should be ready to paste as PR description with minimal edits

---

## Writing style

- Audience: AI agents
- Dense and concise over polished prose
- Focus on what changed + why it matters
- Avoid trivial line-by-line implementation noise
