# Documenting a change

Every story leaves three kinds of record: the commits that made it, a living doc for the feature, and an ADR when a decision was weighed. None of them repeats the others.

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary`, in lower case, no full stop.

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- The scope is the slice or area: `feat(items): add a filter`, `fix(app): keep the back title`, `docs(adr): record the storage choice`.
- A breaking change adds `!`, as in `feat(api)!: rename the id field`, and explains in the body.
- The body says why, not what. The diff already says what.

CI runs `commitlint` over the commits of the PR (the `commits` check), so a message that breaks the format fails the PR.

## Feature docs

`docs/features/<name>.md` describes what a feature does today: its behavior, routes, code, tests and limits. Copy `docs/features/template.md` when you add a feature.

Update the doc in the same PR that changes the feature, so it never lags. Write for a new developer: what a user sees, not how the code works line by line.

## Decisions (ADRs)

Write an ADR in `docs/adr/` when you weighed alternatives and the choice would be costly to reverse, or when a new developer would ask why. See `docs/adr/README.md`. Declining a recommended default from `docs/modules/` is always an ADR (a deviation). The "Decisions weighed" section of the PR is for small choices; an ADR is for the ones that outlive the PR.

## The docs check

The `docs-check` check fails a PR that changes feature code in `src/pages`, `src/features`, `src/entities` or `src/widgets` (tests excluded) without touching `docs/features/` or `docs/adr/`. If no documentation is needed, add the `no-docs` label and say why in the PR description. Adding or removing the label re-runs the check.

## Changelog and releases

`release-please` reads the commit messages on `main` and opens a release PR that updates `CHANGELOG.md` and the version. It is off until the owner opts in, because two things must be set up first:

1. In the repository's Settings, Actions, General, allow GitHub Actions to create and approve pull requests.
2. A pull request opened with the default token does not start the required checks, so the release PR could not be merged. Either create a fine-grained personal access token (contents and pull requests write) and store it as the `RELEASE_PLEASE_TOKEN` secret, or accept opening the release PR by hand.

Then set the repository variable `RELEASE_PLEASE_ENABLED` to `true`. The version `release-please` starts from is the one in `.release-please-manifest.json`, kept equal to `package.json`. Publishing to the stores stays a manual step.

## With the agent

Ask the agent to update the feature doc as part of the change, and to draft an ADR when it weighed alternatives. Review both like code: a wrong doc is worse than none.
