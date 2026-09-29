# House style

The goal is a codebase that reads as if one careful person wrote it: simple, readable, no messy or abstract helpers. Speed matters less than that.

## Write the simplest thing that works

- Pick the most direct solution. If a plain function, a plain component, or a few repeated lines do the job, use them.
- Match the surrounding code: naming, file layout, and idiom. Do not introduce a new pattern next to an existing one.
- Add nothing the task did not ask for: no options, modes, retries, or handling for cases that cannot happen here.

## Search before you write

Before creating a component, hook, or helper, search the repo for one that already does the job (`grep` for the name and for the behavior). Reuse or extend it. Say in the PR what you found.

## When to abstract, and when to leave repetition

Wrong repetition and a wrong abstraction are both defects. Decide each case on its merits.

- Do not abstract from a single use, or from a guess about future uses.
- Consider a shared helper only when there are repeated real uses that change for the same reason.
- Leave a small repetition when merging the copies would need flags, generic types, or indirection that makes each call site harder to read.
- When unsure, leave the repetition and note it in the PR.

Every PR that adds or removes an abstraction, or merges or leaves duplicated code, fills in "Decisions weighed" in the PR description:

- how many real uses there are
- whether the result reads clearer or murkier
- what it costs if the uses later diverge

A human reviewer signs off on that judgment. Tools such as `knip` only find candidates; they do not decide.

## Test IDs and accessibility

Every interactive element, and every text or list a test needs to read, has a `testID`. Interactive elements also have an accessibility label. Maestro and the QA agent depend on these.

Name a `testID` as `<screen>-<element>-<role>`, in kebab-case. The role is one of `button`, `text`, `list`, `input`, or `image`. Repeated elements add their id after the element name.

Examples: `items-main-list`, `items-row-2-button`, `detail-title-text`.

## Checks

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run knip` before opening a PR. Formatting comes from Prettier through ESLint; run `npx eslint . --fix` to apply it.
