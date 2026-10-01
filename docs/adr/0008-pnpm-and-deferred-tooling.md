# 0008. pnpm as the recommended package manager, and tooling weighed and deferred

- Status: accepted
- Date: 2026-10-01

Supersedes [0005](0005-npm-with-npm-10-lockfile.md).

## Context

ADR 0005 chose npm because Expo works with it without extra setup. Two problems that decision handled are no longer open: the npm 11 against npm 10 lockfile mismatch, and a private registry URL ending up in the lockfile. Before tagging the first version we measured what the checks cost, to see which tools would help.

- Local checks take about 16 s in total: typecheck 1.5 s, lint 3 s, tests 4 s.
- The CI `checks` job takes 77 s, of which install is 21 s.
- The two Android device jobs each build the same release APK; the build step is about 840 s, and the jobs take 13 to 17 min in total.

## Decision

- **pnpm is the recommended package manager**, as a module (`docs/modules/package-manager.md`). A client that needs npm or yarn records a deviation.
- **Isolated installs.** pnpm runs in its default mode, which Expo supports from SDK 54. Dependency install scripts are blocked unless listed in `pnpm-workspace.yaml`. If isolated mode breaks the Android build, `nodeLinker: hoisted` goes in the same file and this ADR gets a note.
- **Node and pnpm are pinned** in `.nvmrc` and `package.json`; `eas.json` repeats them because EAS cannot read those files, and a test keeps the copies in step.
- **Deferred: TypeScript 7.** On this repo it passes `tsc`, Jest, Steiger, `knip` and a bundle export and runs `tsc` in 0.5 s instead of 1.5 s, but ESLint fails because typescript-eslint does not support it yet. A compatibility shim works and saves about 1 s. Revisit when typescript-eslint supports TypeScript 7.1.
- **Deferred: oxlint.** It would save about 3 s of lint and would run next to ESLint, because the Callstack React Native rules need ESLint. Revisit with the same trigger.

## Alternatives

- **Stay on npm:** nothing breaks, but it keeps the 21 s install and the lockfile rules.
- **pnpm in hoisted mode from the start:** safest for native builds, but gives up the missing-declaration errors that isolated mode provides. It remains the fallback.
- **Make pnpm a fixed core tool:** simpler skills, but a client could not decline it.
- **TypeScript 7 with the shim now:** current toolchain, at the cost of two aliased packages for a 1 s gain.

## Consequences

- Install is faster, and a missing dependency declaration fails during install or typecheck, not in a client build.
- Every contributor needs Corepack enabled once. The commands in docs, skills and workflows are `pnpm` commands.
- Adding a dependency with an install script needs a line in `pnpm-workspace.yaml`.
- The two deferred tools have a single revisit trigger, so the question is not re-argued before then.
