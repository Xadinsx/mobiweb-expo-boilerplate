---
name: module
description: Add, remove or swap a module (a capability such as styling, storage, translations, the architecture check, device checks or the QA agent) in this project, following its manifest. Use when asked to add, drop, replace or decline a library or check that has a manifest in docs/modules.
disable-model-invocation: true
---

# Add, remove or swap a module

A module is a capability with a manifest in `docs/modules/`. You change it by following its manifest and leave the project green. Read `docs/modules/README.md` first (the index), then only the manifest of the module you are changing. Do not edit other modules' manifests unless a step needs it.

## 1. Ask

1. **Which module** (the index lists them) and **what to do**: add (not installed), remove, or swap for another choice.
2. **Swap:** say the company recommendation and its reason, from the manifest's front matter. Ask what the client wants instead and why. A swap, and also a removal of a module that is not marked as removable, is a deviation: the user may choose it, and you record it.
3. **Add:** refuse with a message if the index says the module is already in use. **Remove or swap:** refuse if it says it is already a deviation, and point to its deviation ADR.

## 2. Check the manifest against the repo

Run each search in "Where the app depends on it" and compare. Also search the docs, `CLAUDE.md`, the README and `.github/` for the module's name; prose that explains a removed module goes stale. If the repo has uses the manifest does not mention, or the manifest names things that no longer exist, correct the manifest in this change and say what you corrected. Do not trust the manifest over the code.

## 3. Apply the steps

Follow "On swap or removal" (or "Adds" for an add) in order. For a removal or swap also:

- Remove the module's dependencies, native plugin and config entries, scripts, CI steps (and required checks, which the user must change in GitHub; tell them), docs, and tests that only exist for it.
- Remove the module's rules from its manifest if it is removed. For a swap, rewrite them to match what is now installed. Rules live in the manifest, not in `docs/ai/house-style.md`.
- After changing dependencies, reinstall so the lockfile is updated (the package manager and its commands are in `docs/modules/package-manager.md`).
- Keep the vendor files working: `vendors/*/vendor.json` stays valid, and every vendor still builds.
- Change the minimum: do not touch code the manifest does not cover. Do not edit the other skills in `.claude/skills`: they read the module index and skip what a removed module owned, and they name no package-manager commands.

## 4. Record it

For a swap or a removal of a recommended default, write a deviation ADR from `docs/adr/template.md` (deviation variant), named `NNNN-deviation-<capability>.md` with the next number, and add it to the table in `docs/adr/README.md`. Update the module's status in `docs/modules/README.md` to `deviation: [NNNN](../adr/...)`, or for a removal of a whole module, say so there. Update `docs/ai/lifecycle.md`, the README and `CLAUDE.md` where they mention the module.

## 5. Check until green

Run, and fix what they report, until all pass:

Use the project's package manager (the Package manager module's manifest, `docs/modules/package-manager.md`, says which one and how to run a script or a local tool). Run these scripts, starting with `eslint . --fix`, in this order:

```text
eslint . --fix
typecheck
test
fsd
dead-code
vendor-isolation
```

If you removed one of these checks (for example the architecture check), skip only that one. Then run every search under the manifest's "Leftover checks". Each must return nothing, except mentions inside the deviation ADR. After an add, the files it lists must exist. A failing check, or a leftover that is not cleared, means the work is not finished: do not report success. Stop and list what is left.

Also run `git diff package.json`: the `android` and `ios` scripts must stay `expo run:android` and `expo run:ios` (Expo tooling may rewrite them).

## 6. Report

Show `git status`. List the manifest steps you did, any you skipped and why, the corrections to the manifest, and the deviation ADR. Remind the user of changes outside the repo (required checks, repository secrets or variables) and to have the diff reviewed by a person. Tell them to note the session's token use from the app's usage view (you cannot read it).
