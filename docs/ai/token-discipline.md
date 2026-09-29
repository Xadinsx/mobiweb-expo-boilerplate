# Token discipline

Tokens are money and attention. These rules keep AI use cheap without making it worse.

## Rules

- **Keep `CLAUDE.md` short.** It loads every session. Put detail in linked docs the agent reads only when needed.
- **One task, one session.** Start a fresh session per ticket. Do not carry a long history into unrelated work.
- **Plan, then execute.** For anything beyond a small change, write or read a plan first, then implement it. Rework after a wrong start costs more than planning.
- **Match the model to the task.** Use a small, fast model for narrow mechanical work such as formatting, renames, and the QA agent. Use a stronger model for design and review.
- **Load skills on demand.** Enable only the skills in `docs/ai/onboarding.md`. Each installed skill adds to context.
- **Do not read the whole repo.** Search with targeted patterns and read file ranges. `node_modules`, build output, and lockfiles are blocked in `.claude/settings.json`.
- **Stop patching in circles.** If two fixes for the same failure did not work, name the assumption they share and check it.

## Provisional budget per ticket

These numbers are placeholders. Replace them with measured values after the first sample ticket runs through the lifecycle.

| Ticket size | Rough scope | Provisional total tokens |
|---|---|---|
| Small | One file or a small fix | 300k |
| Medium | A screen or feature slice, a few files | 1M |
| Large | Several features or a cross-cutting change; needs a plan | 3M |

If a ticket passes its budget, stop and check whether the plan or the approach is wrong before continuing.

## Checking usage

- In Claude Code, run `/cost` for the current session's tokens and spend, and `/usage` for your plan usage.
- Note the total for each ticket in the PR description so the budget can be recalibrated.
