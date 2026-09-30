# Mobiweb Expo Boilerplate

A starting point for Mobiweb Expo apps, with a documented workflow for shipping with Claude Code: house rules, CI gates, device tests, and a QA agent on pull requests.

The app itself is a small sample: an items list that opens a detail screen.

## Quick start

You need Node 22.12 or newer.

```bash
npm ci
npx expo run:android   # or: npx expo run:ios
```

The app uses native modules (Unistyles, MMKV), so Expo Go does not work. `expo run:android` builds a development app and starts it; after that, `npx expo start` reopens the dev server.

## Commands

| Command | What it does |
|---|---|
| `npm run typecheck` | TypeScript, strict |
| `npm run lint` | ESLint with the Callstack config and Prettier |
| `npm test` | Jest and React Native Testing Library |
| `npm run fsd` | Steiger: Feature-Sliced Design import rules |
| `npm run dead-code` | knip: unused files, exports and dependencies |

Run all five before opening a PR. CI runs them too.

## Working with Claude Code

Start with [`docs/ai/onboarding.md`](docs/ai/onboarding.md). The rest of [`docs/ai/`](docs/ai/):

- [`lifecycle.md`](docs/ai/lifecycle.md): the path from ticket to release, and which checks gate a merge.
- [`house-style.md`](docs/ai/house-style.md): how to keep the code simple, when to abstract, and the test id convention.
- [`token-discipline.md`](docs/ai/token-discipline.md): keeping token use low.
- [`../adr/`](docs/adr/): why the important decisions were made (architecture decision records).
- [`docs-workflow.md`](docs/ai/docs-workflow.md): commit format, feature docs, ADRs and the docs check.
- [`qa-agent.md`](docs/ai/qa-agent.md): the QA agent that checks the app on an emulator for each PR.

[`CLAUDE.md`](CLAUDE.md) holds the short rules Claude Code reads in every session.

## Checks on a pull request

- `checks`: typecheck, lint, tests, Feature-Sliced Design rules, dead code.
- `commits`: Conventional Commits, checked with commitlint.
- `docs-check`: feature changes need a feature doc or an ADR (label `no-docs` to skip).
- `secret-scan`: gitleaks over the history.
- `ticket-key`: Jira key in the branch and title, only when the repository variable `REQUIRE_TICKET_KEY` is `true`.
- `maestro-android` and `qa-agent`: build the app and test it on an Android emulator. They run only when a PR can change the app.

Plans for larger work live in [`docs/plans/`](docs/plans/).
