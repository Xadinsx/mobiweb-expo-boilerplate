# 0004. The QA agent is Claude Code driving agent-device

- Status: accepted
- Date: 2026-09-30

## Context

Every PR that can change the app should get a bounded check of the affected flow, with screenshots and a report a reviewer can read. The plan was to trial Vercel Eve with a model API key. The route approved by the repo owner is their Claude account, which Claude Code can use in CI and Eve cannot.

## Decision

Run Claude Code headless in the `qa-agent` GitHub Actions job, allowed only to run `agent-device` commands, on the emulator built by the job. It returns one JSON report that `scripts/agent-qa/report.mjs` validates and turns into a PR comment and a check result. It uses a small model, 40 turns and a $0.50 ceiling per run. Details and trial results are in `docs/ai/qa-agent.md`.

## Alternatives

- Vercel Eve with an API key: more structure for the agent, but needs a separate provider route and key.
- Claude Code with an API key: a real spend cap, but needs the same provider approval.
- No agent, Maestro only: cheaper, but only checks flows someone scripted.

## Consequences

- The token is a whole-account login and cannot be spend-capped, so the job runs only for same-repository PRs, the secret is visible only to the agent step, and the agent has no shell, file or network tools.
- Changes to the workflow, the agent files, `CLAUDE.md` and Claude settings need code owner review.
- A tooling failure or an inconclusive run fails the check until a reviewer adds the `qa-acknowledged` label and re-runs it.
