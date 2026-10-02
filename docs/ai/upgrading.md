# Upgrading a project from the boilerplate

A project made from the template has its own git history. It shares no commits with the boilerplate, so `git merge` and `git pull` cannot bring in later fixes. This page describes how to take them by hand, and how to move to a new Expo SDK.

Status: the patch method in "Taking boilerplate changes" was checked on a scratch copy (a tag-to-tag diff applied with `git apply --3way` to a project with unrelated history, including a deliberate conflict). The SDK steps are not rehearsed; the first real SDK upgrade should correct this page.

## What a project owns and what it inherits

Upgrades only touch what the project inherits. Never overwrite what it owns.

| Owned by the project (skip in a patch) | Inherited from the boilerplate (take) |
|---|---|
| `vendors/` (all vendor config and assets) | `.github/workflows`, `.github/actions`, `.githooks`, `scripts/` |
| `docs/features/`, the project's own ADRs, `docs/plans/` | `docs/ai/`, `docs/modules/`, the inherited ADRs |
| `README.md` and `CLAUDE.md` opening sections, `.github/CODEOWNERS` | `src/shared/`, `src/app/`, and other FSD code the project did not replace |
| `package.json` `name` and `version`, `.release-please-manifest.json` | dependency versions, scripts, `pnpm-workspace.yaml`, `.nvmrc` |
| `app.config.ts` `boilerplateEas` block | the rest of `app.config.ts` |
| The features the project built (and the sample items feature if kept) | `test/`, `jest.setup.ts`, lint and architecture config |

A module the project declined (a deviation ADR) is also skipped: leave out the paths its manifest in `docs/modules/` lists under "Where the app depends on it".

## Where the project records its version

`/new-project` writes the boilerplate version it started from in `docs/adr/README.md` ("inherited from boilerplate vX"). After each upgrade, change that sentence to the new tag, so the next person knows where to diff from. If the sentence is missing, find the version by comparing the project's files with each tag, starting from the oldest.

## Taking boilerplate changes

Do this when the boilerplate publishes a tag you want, such as a fix to the CI workflows or a new module. One upgrade is one PR; do not mix it with feature work.

1. Add the boilerplate as a remote and fetch its tags. Fetching brings in the old file versions git needs for a three-way merge.

   ```bash
   git remote add boilerplate git@github.com:Xadinsx/mobiweb-expo-boilerplate.git
   git fetch boilerplate --tags
   ```

2. Read what changed before applying anything. The boilerplate has no changelog file yet, so use the commit list and the file summary:

   ```bash
   git log --oneline <from-tag>..<to-tag> --no-merges
   git diff --stat <from-tag> <to-tag> -- . ':!docs/plans'
   ```

   Decide which parts the project wants. Skip the changes to the paths in the left-hand column of the table above and to declined modules.

3. On a new branch, apply the diff of the paths you want. Exclude lockfiles and project-owned paths; the lockfile is regenerated in step 5.

   ```bash
   git switch -c chore/boilerplate-<to-tag>
   git diff <from-tag> <to-tag> -- . ':!docs/plans' ':!pnpm-lock.yaml' ':!vendors' ':!docs/features' ':!README.md' ':!CLAUDE.md' ':!.github/CODEOWNERS' \
     | git apply --3way
   ```

   Files the project did not touch apply cleanly. Files both sides changed get conflict markers and show as `U` in `git status`. Resolve them by hand, keeping the project's `name`, `version` and `boilerplateEas`. A `package.json` `version` conflict is expected and always resolves to the project's own.

4. If the diff touches a file the project deleted, such as the sample items feature, git reports it. Discard that part; do not bring the sample back.

5. Install, so the lockfile matches `package.json`, then run the full gate:

   ```bash
   pnpm install
   pnpm typecheck && pnpm lint && pnpm test && pnpm fsd && pnpm dead-code && pnpm vendor-isolation
   ```

   Use the project's package manager if it declined pnpm (see `docs/modules/package-manager.md`).

6. Update the version sentence in `docs/adr/README.md`. Add an ADR only if the project made a new decision while upgrading, such as declining a module the boilerplate added.

7. Open the PR. Describe it as "boilerplate upgrade `<from>` to `<to>`", list what was taken and what was skipped and why, and note any change that needs a device check (for example native dependencies). Have a person read the diff, as for any other PR.

New modules in the boilerplate get the same treatment as at project start: read the manifest in `docs/modules/`, then keep, swap or drop it with `/module`. The patch above brings the manifest and code in; `/module` records a deviation if the project declines it.

## Moving to a new Expo SDK

The boilerplate moves first, and projects follow. This keeps one place where the SDK upgrade is worked out, and every project then takes the result as a boilerplate upgrade.

### In the boilerplate

1. Read the Expo release notes for the new SDK and the matching React Native version. Note breaking changes that touch modules the boilerplate uses: Unistyles, MMKV, Expo Router, i18next, TanStack Query.
2. On a branch, move Expo and align everything to it:

   ```bash
   pnpm expo install expo@<new-sdk>
   pnpm expo install --fix
   ```

   `--fix` sets every Expo-managed package to the version the SDK expects. Packages outside Expo's list (Unistyles, MMKV, TanStack Query) are checked by hand against their own release notes for the new React Native version.
3. If Node or pnpm must change, change `.nvmrc`, `package.json` (`engines`, `packageManager`) and `eas.json` together. `test/tooling/versions.test.ts` fails when they disagree.
4. Run the full gate. Then build a development build for Android through the Maestro workflow, because native modules can fail at build time while the checks pass. A passing `maestro-android` and `qa-agent` run is the evidence.
5. Note what broke and how it was fixed in the PR or an ADR when a decision was weighed. Tag the result. Native dependency changes make this at least a minor version.

### In a project

1. Wait for the boilerplate tag; do not upgrade the SDK in the project first.
2. Follow "Taking boilerplate changes" with the SDK tag. The dependency changes in `package.json` apply as part of the patch.
3. Run `pnpm install`, then `pnpm expo install --fix` once more, because the project may have added Expo packages the boilerplate does not have.
4. Rebuild the development build. The old build does not run on a new SDK, and the Maestro and QA agent checks use a fresh build, so they test the upgrade.
5. If the project has store builds, run a release build on both platforms before merging; the boilerplate does not cover this yet (release automation is not built).

The Expo version check in CI was removed on purpose and is not part of this process. Alignment is a manual step (`expo install --fix`) done during an upgrade.

## When not to upgrade

- During the last weeks before a release, unless the change fixes a bug the project has.
- When the tag only changes boilerplate-only material: its plans, the sample feature, or the `new-project` skill (which the project deleted).
- A project that skips several tags can still apply one diff from its recorded version to the latest, but the larger the range, the more conflicts. Upgrade at least once per boilerplate minor version.

## Maintaining this page

Whoever finds a step that is wrong or missing while upgrading fixes it in the same PR as the upgrade. Rehearse the page on a scratch project (create one from the previous tag, then apply a later tag by following it) before relying on it for a client project.
