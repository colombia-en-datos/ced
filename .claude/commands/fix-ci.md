# Fix Formatting and Lint Issues

Fix all Biome formatting, linting, and TypeScript issues in the project so the code is ready to merge to main.

## Workflow

### 1. Auto-fix formatting and lint

Run `pnpm biome check --write` to auto-fix all safe issues (formatting, import sorting, and auto-fixable lint rules).

### 2. Fix remaining lint issues

Run `pnpm biome check` and parse the output. Work through each remaining issue:

1. Read the file at the reported line
2. Understand the rule that triggered (the rule name tells you exactly what's wrong)
3. Apply the fix — common fixes include:
   - **correctness/noUnusedImports**: Remove the unused import
   - **correctness/useExhaustiveDependencies**: Add or remove dependencies from the hook's dependency array
   - **suspicious/noArrayIndexKey**: Use a stable unique key instead of the array index
   - **suspicious/noExplicitAny**: Replace `any` with a proper type
   - **a11y/useValidAnchor**: Replace `href="#"` with a valid URL or use a `<button>`
   - **a11y/useSemanticElements**: Replace the element with the appropriate semantic HTML element
   - **a11y/useFocusableInteractive**: Add `tabIndex` to make interactive elements focusable
   - **security/noDangerouslySetInnerHtml**: Refactor to avoid `dangerouslySetInnerHTML`, or suppress with `biome-ignore` comment if truly necessary
4. After fixing each file, run `pnpm biome check` on it to confirm the fix

### 3. Type-check

Run `pnpm typecheck` and fix any TypeScript errors:

1. Read the failing file and understand the type error
2. Fix the root cause — common fixes include:
   - **Missing types**: Add proper type annotations
   - **Type mismatches**: Fix the value or update the type
   - **Missing properties**: Add required properties to objects
   - **Import errors**: Fix module paths or missing exports
3. Re-run `pnpm typecheck` after each fix to confirm

Focus on the actual errors — do not refactor passing code or add unnecessary type annotations.

### 4. Verify

Run all checks and fix any remaining issues:

```bash
# Check Biome passes (formatting + linting)
pnpm biome check

# Check TypeScript compiles
pnpm typecheck
```

If any check still reports issues, go back and fix them. Repeat until both pass cleanly.

### 5. Summary

Once all checks pass, summarize:
- Number of files modified
- Types of issues fixed (grouped by category: formatting, lint, types)
- Any issues that required non-trivial refactoring
