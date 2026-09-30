# QA agent

Status: not built yet. This page records the decisions made so far. The trial that measures real cost comes next.

## Provisional limits

Set by the repo owner before the first trial run. Replace them with measured values after the trial.

| Limit | Value |
|---|---|
| Model cost per PR run, hard ceiling | $0.50 |
| Model cost per PR run, target | $0.15 or less |
| Monthly spend cap on the QA model key | $25 |
| Agent steps per run | 25 |

After the first 5 to 10 real PRs, record the measured average and worst case here, and move the per-run ceiling to about twice the worst observed run.

## Rules for the trial

- Start with a small, fast model and move up only if the reports are poor.
- Use a dedicated API key with the monthly cap above, kept in its own secret environment. Never commit it or paste it into a prompt.
- Do not add the key until Mobiweb security has approved the model provider route, and record that approval below.
- Run only against builds with seeded test data.
- Keep Vercel Eve only if the per-run cost stays under the ceiling, its behavior stays in a few small files, and its output validates against a schema without custom scaffolding. Otherwise use Claude with agent-device directly.

## Approval

Model provider route approved by Mobiweb security: not yet. Record the date, approver, and route here.

## Result of the trial

Not run yet.
