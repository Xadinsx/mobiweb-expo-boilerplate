# QA agent

On every same-repository pull request, a GitHub Actions job (`qa-agent`) builds the app, boots an Android emulator, and lets Claude Code check the flows the change could affect. It posts one report as a PR comment and links the screenshots.

## How it works

1. The job builds the release APK from the PR's code and installs it on an API 34 emulator.
2. Claude Code runs headless with the instructions in `scripts/agent-qa/instructions.md`. It gets the PR title and diff as data, and it may run only `agent-device` commands (open the app, tap, read the screen, take screenshots). It has no shell, file or network tools.
3. It returns one JSON report: `pass`, `product_issue`, or `inconclusive`. `scripts/agent-qa/report.mjs` checks that report, writes the PR comment, and decides the check result.
4. The comment is created once and edited on later pushes.

| Report | Check result |
|---|---|
| `pass` | passes |
| `product_issue` | fails |
| `inconclusive`, or no usable report (a tooling failure) | fails until a reviewer adds the `qa-acknowledged` label to the PR and re-runs the job |

A passing report is evidence, not approval. The reviewer still reads the diff.

## Limits

Set by the repo owner before the first trial run. Replace them with measured values after the trial.

| Limit | Value |
|---|---|
| Model cost per PR run, hard ceiling | $0.50 (enforced with `--max-budget-usd`) |
| Model cost per PR run, target | $0.15 or less |
| Agent turns per run | 25 |
| Monthly cap | $25 planned. The agent runs on the owner's Claude subscription, which has no dollar cap, so watch usage in the Claude settings. |

The cost the job reports is what the same usage would cost through the API. After the first 5 to 10 real PRs, record the measured average and worst case here, and move the per-run ceiling to about twice the worst observed run.

## Credentials and data

- The job authenticates with a long-lived Claude login token in the `CLAUDE_CODE_OAUTH_TOKEN` secret of the `qa-agent` GitHub environment. It is visible only to the step that runs the agent, never to the build steps.
- The job never runs for forks. Changes to `.github/workflows/`, `scripts/agent-qa/`, `.claude/settings.json` and `CLAUDE.md` need code owner review, because they decide what the agent sees and does. This only holds once the placeholder in `.github/CODEOWNERS` is replaced.
- The agent sees the PR title, the diff (cut at 60,000 characters) and screenshots of the sample app with seeded test data. Do not point it at builds with real accounts or client data.
- Screenshots are kept as GitHub artifacts for 7 days.
- To stop the agent, revoke the token in the Claude account settings and delete the secret. Rotate the token when the owner changes.

## Approval

Using the repo owner's Claude account for the QA runs was confirmed as approved by the repo owner on 2026-09-30. Add the approver's name and a link or ticket reference here.

## Decision: Claude Code, not Vercel Eve

The plan was to try Vercel Eve with a model API key. The approved route is the owner's Claude account, which Claude Code can use in CI but Eve cannot. So the agent is Claude Code driving `agent-device`, the fallback the plan named.

## Result of the trial

Not run yet.
