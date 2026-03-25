# Fill PR template from git diff vs parent branch

**What it does:** Detect the most likely *parent/base* commit for the current branch, inspect the changes since that parent, and fill `.github/pull_request_template.md` with a copy-ready PR description for AI agents

**Usage:** `/git-pr-fillout-template` -> detect parent -> gather evidence (diff/name/stat + commits) -> output completed PR description as markdown

---

## Output contract

- Return the PR description as **plain markdown text** (no outer triple-backtick code fence)
- Do not write files
- Keep phrasing terse and high-signal for AI agent reviewers
- Bullets: no trailing punctuation

---

## Steps

1. **Read template and identify SHAs**
   - Read `.github/pull_request_template.md` (use its section headings verbatim)
   - `CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)`
   - `HEAD_SHA=$(git rev-parse HEAD)`
   - Resolve `DEFAULT_BRANCH` from `origin/HEAD` once:
     - `DEFAULT_BRANCH=$(git symbolic-ref -q refs/remotes/origin/HEAD | sed 's#^refs/remotes/origin/##' )`
     - If empty: try `main`, else `master`
   - `DEFAULT_SHA=$(git rev-parse "$DEFAULT_BRANCH")` (exit/handle errors if missing)

2. **Detect parent/base commit (`PARENT_SHA`)** (accuracy first; stop at first valid match)

   **Hard rule:** never choose the current branch tip as the parent.
   - If `git rev-parse "$CAND_REF" == "$HEAD_SHA"`, skip that candidate

   a. **Reflog signals (highest confidence)**
   - Look at reflog for the current branch tip (newest first, bounded):
     - `git reflog show "$CURRENT_BRANCH" -n 50`
   - Extract candidate refs from structured substrings:
     - `branch: Created from refs/heads/X`
     - `checkout: moving from X to CURRENT_BRANCH`
   - Normalize each candidate `X` to an actual ref the repo can resolve:
     - Prefer `refs/heads/X`
     - Else try `refs/remotes/origin/X`
     - Else skip
   - Validate candidate commit:
     - Compute `CAND_SHA=$(git rev-parse "$CAND_REF")`
     - Require `git merge-base --is-ancestor "$CAND_SHA" "$HEAD_SHA"` (candidate must be an ancestor)
     - Require `CAND_SHA != HEAD_SHA`
   - Pick the first reflog candidate that passes all validations

   b. **Default branch fallback**
   - Consider `DEFAULT_SHA` as `PARENT_SHA` if:
     - `DEFAULT_SHA` is an ancestor of `HEAD_SHA`
     - `DEFAULT_SHA != HEAD_SHA`

   c. **Optional naming heuristic (only if branch name contains a ticket-like token)**
   - If `CURRENT_BRANCH` matches `CG-####` (or other fixed convention tokens used in this repo),
     prefer a candidate local branch with the same prefix and a *lower* number.
   - Validate the same way as above (ancestor + not equal).
   - If nothing passes, keep the `DEFAULT_SHA` result (if valid) or report inability to confidently detect a base.

   d. **If still uncertain**
   - Fallback to `DEFAULT_SHA` if valid; otherwise stop and ask the caller to provide the base branch explicitly.

3. **Gather compact evidence (fast path)**
   - `git diff --name-only "$PARENT_SHA...$HEAD_SHA"` -> `CHANGED_FILES`
   - `git diff --stat "$PARENT_SHA...$HEAD_SHA"` -> `DIFF_STAT`
   - `git log "$PARENT_SHA..$HEAD_SHA" --no-merges --format='%s%n%b' | head -n 120` -> `COMMITS`
   - (Avoid full `git diff` blobs by default; only inspect specific files if the narrative needs it.)

4. **Analyze for PR narrative (commit-first, evidence-backed)**
   - Use `COMMITS` to infer:
     - primary goal + approach
     - major themes/components touched
     - whether anything looks risky/deploy-impacting (only if commit text or file paths indicate it)
   - Testing + checklist:
     - Only mark checklist items `[x]` when you have direct evidence from `CHANGED_FILES` and/or commit text
     - If you cannot verify, keep `[ ]`

5. **Fill template sections**
   - Use repo template section names verbatim
   - Under `Summary` / description content:
     - Include the required banner line:
       - `**🎯 PARENT BRANCH DETECTED: <parent label> 🎯**`
     - `<parent label>` should be the resolved branch name when possible (e.g. `main`), otherwise use the `PARENT_SHA` shortened
   - `Screenshots`: `N/A` unless the evidence indicates UI/visual behavior changes
   - `What changed`: numbered list ordered by importance
     - brief sub-bullets are allowed
   - `Notes for reviewers`:
     - list what reviewers should focus on (from evidence)
     - include suggested verification commands that are consistent with the repo template checklist

6. **Return result**
   - Return **only** the filled PR description markdown (no outer code fence)
   - Do not include commentary, preambles, or “here is the text” wrappers

---

## Writing style

- Audience: AI agents
- Dense and concise over polished prose
- Focus on what changed + why it matters
- Avoid trivial line-by-line implementation noise
