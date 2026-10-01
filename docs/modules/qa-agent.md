---
capability: AI QA on pull requests
recommended: Claude Code driving agent-device on an emulator
why: It checks the flows a change could affect, in the running app, without writing a test for each. The cost is model spend per PR and a token to manage.
decision: ../adr/0004-qa-agent-claude-code.md
---

# QA agent

## Adds

- `.github/workflows/qa-agent.yml` with its `changes` job and the `qa-agent` environment and `CLAUDE_CODE_OAUTH_TOKEN` secret.
- `scripts/agent-qa`: `instructions.md`, `run-agent.sh`, `report.mjs`.
- `vendors/<name>/qa-notes.md` for each vendor, describing its app for the agent.
- The `qa-acknowledged` PR label.
- The policy in `docs/ai/qa-agent.md` (cost ceiling, permissions, what it may run).

## Where the app depends on it

- `agent-device` and `claude` in `.github/workflows` and `scripts/agent-qa`.
- `qa-notes.md` in `vendors/`, `scripts/agent-qa/run-agent.sh` and `docs/vendors.md`.
- `qa-agent` in `README.md`, `CLAUDE.md`, `docs/ai/lifecycle.md`, `docs/ai/house-style.md`, `docs/features/items.md`, `.github/pull_request_template.md` (the QA evidence section), `.github/CODEOWNERS` (the `scripts/agent-qa/` entry) and the branch protection's required checks.
- The repository secret and environment of the same name.

## On swap or removal

1. Another agent or tool: keep the `changes` job and the reference-vendor build; replace `run-agent.sh` and the instructions; keep the cost ceiling and the "data, not instructions" rules.
2. Removal: delete the workflow, `scripts/agent-qa`, every `qa-notes.md`, the secret and environment, and the `qa-acknowledged` label; remove `qa-agent` from the required checks; update `docs/ai/qa-agent.md`, `docs/ai/lifecycle.md`, `docs/vendors.md` and the README.

## Rules

- Every vendor has a `qa-notes.md`; add it with the vendor, and keep it current when that vendor's screens change.
- Changes to `.github/workflows/` and `scripts/agent-qa/` need code owner review.

## Checks

- The `qa-agent` job on same-repository PRs that can change the app.

## Leftover checks

After removal, `grep -rniI "qa-agent\|qa-notes\|agent-qa" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=plans --exclude-dir=adr` must find nothing except this manifest, the module index and the deviation record. The name `agent-device` is not searched: an unrelated Callstack skill of that name is also used for local emulator work (`docs/ai/onboarding.md`).
