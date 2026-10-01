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

## Measured cost of the project skills

Measured on 2026-09-30 and 2026-10-01 by running each skill headless on a throwaway copy of the repo, with the answers given in the prompt. Each row is one run that finished with the checks green, unless the note says otherwise. Cost is what the run reported; cached input is most of the volume because the conversation is re-read on every turn. A person answering questions interactively adds turns, so treat these as a floor.

| Skill run | Turns | Cost | Time |
|---|---|---|---|
| `/add-vendor`, one vendor, no new language | 26 | $0.55 | 1.7 min |
| `/add-vendor`, one vendor and a new language (Spanish) | 44 | $0.91 | not recorded |
| `/module`, remove the architecture check | 54 | $1.03 | not recorded |
| `/module`, remove the device checks | 69 | $1.40 | 4.5 min |
| `/module`, remove the QA agent | 100 | $2.52 | not recorded |
| `/module`, swap styling to plain `StyleSheet` | 116 | $3.46 | about 10 min |
| `/new-project`, swapping styling | 159 | $3.66 | about 8 min |

The chained run (`/new-project` dropping the QA agent, then `/add-vendor`, then `/module` removing device checks) cost about $3.43 in total over 152 turns and 11 minutes of run time. Its first and last steps stopped to ask for permission to edit another skill, which led to the module-aware skills described below; the costs above are what those runs spent before stopping.

Rules of thumb: adding a vendor costs under $1; dropping a module costs $1 to $3 depending on how many files it touches; a whole new project costs about $4. The single most expensive thing is swapping a library that many files import, because every file is rewritten.

What the runs taught, now in the skills and manifests:

- A run cannot approve its own deletions or edits to `.claude/`, so each skill asks for confirmation up front and removes tracked folders with `git rm -r`.
- Unit tests must not read a real vendor's values (the first chained run failed two tests because a client's vendor defaulted to dark), so they use the fixture in `test/vendor`.
- Skills read the module index and skip steps for modules a project has removed, so removing a module never requires editing a skill.
