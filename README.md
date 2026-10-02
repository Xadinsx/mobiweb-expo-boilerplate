# Mobiweb Expo Boilerplate

A starting point for Mobiweb Expo apps, with a documented workflow for shipping with Claude Code: house rules, CI gates, device tests, and a QA agent on pull requests.

The app itself is a small sample: an items list that opens a detail screen.

## Quick start

You need Node 22 (see `.nvmrc`) and pnpm, which Corepack provides at the version in `package.json`.

```bash
corepack enable
pnpm install
pnpm expo run:android   # or: pnpm expo run:ios
```

The app uses native modules (Unistyles, MMKV), so Expo Go does not work. `expo run:android` builds a development app and starts it; after that, `pnpm expo start` reopens the dev server.

## Start a client project

This repository is a GitHub template. Versions are tagged (`v0.2.0` is the latest), and `/new-project` records which one a project started from.

1. Use the template (GitHub's "Use this template") to create the client's repository, clone it, run `corepack enable` and `pnpm install`, and create a branch.
2. Open the repository in Claude Code and run `/new-project`. It asks for the client's name, the first vendor's identity and look, the code owners, and for each module (styling, storage, translations, architecture check, device checks, QA agent, package manager) whether to keep the recommended default, swap it or drop it. A swap or a drop is recorded as a deviation ADR with the reason.
3. It then rewrites `vendors/default` as the client's first vendor, removes the sample vendor, the boilerplate's plans and itself, applies your module choices, and runs every check until they pass. The ADR index records which boilerplate version the project started from.
4. Review the diff like any other, commit it on the branch, and open a pull request.

The items list and detail are a sample feature. They stay as the reference for structure, tests and the device flow; replace them with the client's first real feature, and rewrite `.maestro/flows`, each vendor's `qa-notes.md` and `docs/features/items.md` with it.

A few things only you can do, and the skill lists them when it finishes: run `eas init` and put the ids in `app.config.ts`, set branch protection and the required checks in GitHub, add the QA agent's token if you keep that module, and get any approval your client needs for third-party services.

Afterwards, `/add-vendor` adds another vendor to the project and `/module` adds, removes or swaps a module. Both are described in `docs/vendors.md` and `docs/modules/README.md`.

## Commands

| Command | What it does |
|---|---|
| `pnpm typecheck` | TypeScript, strict |
| `pnpm lint` | ESLint with the Callstack config and Prettier |
| `pnpm test` | Jest and React Native Testing Library |
| `pnpm fsd` | Steiger: Feature-Sliced Design import rules |
| `pnpm dead-code` | knip: unused files, exports and dependencies |

Run all five before opening a PR. CI runs them too.

## Working with Claude Code

Start with [`docs/ai/onboarding.md`](docs/ai/onboarding.md). The rest of [`docs/ai/`](docs/ai/):

- [`lifecycle.md`](docs/ai/lifecycle.md): the path from ticket to release, and which checks gate a merge.
- [`house-style.md`](docs/ai/house-style.md): how to keep the code simple, when to abstract, and the test id convention.
- [`modules/`](docs/modules/README.md): each capability the boilerplate ships (styling, storage, translations, architecture check, device checks, QA agent), its recommended default, and what changes if a client declines it.
- [`token-discipline.md`](docs/ai/token-discipline.md): keeping token use low.
- [`../adr/`](docs/adr/): why the important decisions were made (architecture decision records).
- [`docs-workflow.md`](docs/ai/docs-workflow.md): commit format, feature docs, ADRs and the docs check.
- [`qa-agent.md`](docs/ai/qa-agent.md): the QA agent that checks the app on an emulator for each PR.
- [`upgrading.md`](docs/ai/upgrading.md): how a project takes later boilerplate changes and moves to a new Expo SDK.

[`CLAUDE.md`](CLAUDE.md) holds the short rules Claude Code reads in every session.

## Checks on a pull request

- `checks`: typecheck, lint, tests, Feature-Sliced Design rules, dead code.
- `commits`: Conventional Commits, checked with commitlint.
- `docs-check`: feature changes need a feature doc or an ADR (label `no-docs` to skip).
- `secret-scan`: gitleaks over the history.
- `ticket-key`: Jira key in the branch and title, only when the repository variable `REQUIRE_TICKET_KEY` is `true`.
- `maestro-android` and `qa-agent`: build the app and test it on an Android emulator. They run only when a PR can change the app.

Plans for larger work live in [`docs/plans/`](docs/plans/).
