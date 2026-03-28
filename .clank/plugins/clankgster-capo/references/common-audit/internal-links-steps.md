# Common steps: internal links audit

1. Resolve target and collect markdown files (or single markdown file target).
2. Extract markdown links and filter to relative links.
3. Resolve each target path from source location.
4. Validate existence.
5. For existing targets, validate label-to-content alignment.
6. Classify each as OK, Broken, Mismatch, or Ambiguous.
7. Optionally scan for relative markdown links that resolve but appear only inside monospace (inline code delimiters). If the path resolves and the prose is clearly a followable example, record as a **low** documentation-hygiene note (see [internal-links-scope.md](internal-links-scope.md)).
