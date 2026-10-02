# Pilot of the Mobiweb Expo boilerplate on a real client project

Created: 2026-10-02

**Goal:** find out, with real work, whether the boilerplate (`v0.2.0`) can be Mobiweb's standard starting point for client apps, and close the gaps that stop it from being one.

**Decided:** a real client project is lined up (name and start date to fill in). The owner runs the first walkthrough alone, as a fresh start. The pilot runs until the first three or four features ship. "Ship" means merged and available in an internal build, not in a store, because store release is blocked on accounts and approvals.

**Context:** a few client apps a year, one small team. Models come from a mix of company seats and API keys. Quality and simple readable code come first; the main fear is bugs reaching users.

**Verdict before the pilot:** ready to pilot, not yet a company standard. The evidence so far is AI rehearsals with scripted answers. No human has used it, no real project is built on it, and the sample app is an items list.

## Phase 0: Before the project starts

| Step | Who | Output |
|---|---|---|
| Walkthrough: create a repo from the template, run `/new-project` for the client's identity, with no help, and write down every unclear moment | Owner | A client repo whose checks pass, and a friction log |
| Check the client agreement: does it allow AI-assisted development, and which providers may see their code? | Owner | A yes or no, and any limits. This decides what the rest can do. |
| Repo setup only the owner can do: `eas init`, a fresh QA agent token, branch protection, `commits` and `docs-check` as required checks. Replace the CODEOWNERS placeholder, or note that code-owner review is not enforced. | Owner | A project protected like the boilerplate |
| Decide the cross-model review question (yes or no) and the model defaults per step; record both as repo settings | Owner decides, assistant records | Two settings, no per-case asking |
| Fix anything in the friction log that blocks a new project | Assistant | Boilerplate fixes, tagged as a patch release |

**Exit:** the client repo exists, its checks pass, and the friction log has no blockers.

## Phase 1: Build the first three or four features

- Replace the sample items feature with the client's first real feature. Rewrite the Maestro flow, the vendor QA notes and the feature doc with it, as the README says.
- Use the lightweight path for small changes. Use the full plan, work and review chain only for large or risky ones. Keep PRs small and sequential. The owner reads each diff and the "decisions weighed" section.
- When the client needs something the template lacks (login, navigation structure, push, a real backend), build it as a feature and log whether the boilerplate's patterns fit. If the need recurs across projects, it becomes a candidate module.
- **Rule for client pressure:** if a boilerplate problem blocks delivery for more than half a day, work around it, log it, and fix it later. The pilot must not put the client's schedule at risk.

## Phase 2: Measure as you go

| Measure | How to collect |
|---|---|
| Time from first commit to merged PR, and from PR open to approval | GitHub, per PR |
| Bugs that reach users after merge | A running list, one line per bug and feature |
| AI cost per PR and per feature | Session usage views; the QA agent's "Usage" line on each PR |
| Boilerplate friction and workarounds | The friction log, one line each; record a deviation ADR when a module is declined |
| CI time per PR and device-check duration | Actions run data |

There is no baseline today. If the team has numbers from a previous project, use them for comparison. Otherwise judge each measure against the owner's sense of "normal".

## Phase 3: Decision, after the 3rd or 4th feature ships

Review the log and the measures, then choose one: adopt as the company starting point, adopt with named changes, or drop parts. Suggested criteria (the owner sets the numbers):

- No boilerplate problem blocked delivery for more than a day without a logged fix.
- Every logged deviation was either fixed in the boilerplate or accepted on purpose.
- AI cost per feature fits a budget the owner sets.
- Bugs reaching users are no worse than on the last project.
- The owner would start the next project from it.

## In parallel: the upgrade-path document

The largest gap for a small team: a project started from the template has no way to take later fixes.

- **Deliverable:** `docs/ai/upgrading.md`, covering how a project records its starting version (already in the ADR index), how to take boilerplate changes (compare tags and apply selectively, using the module manifests as checklists), and how to move to the next Expo SDK (upgrade the boilerplate first, tag it, then projects follow).
- **Owner of the draft:** assistant. The owner reviews it.
- **Proof:** rehearse it on a scratch project. Create one from `v0.2.0`, then apply a later tag's changes by following the document.

## Models per step (a setting, not an architecture decision)

| Step | Default |
|---|---|
| Planning, brainstorming, review of risky changes, architecture decisions | Strongest available model |
| Implementing approved plan units, routine review | Mid-tier model |
| QA agent, simple classification | Small, fast model |
| Second-model review of a diff | Only with the owner's confirmation, because code leaves the machine |

Jev (TypeSafe AI's classifier model, early access) is not relevant now.

## Contingencies

- If the walkthrough shows `/new-project` is confusing, fix the skill and repeat the walkthrough before the client project starts.
- If the client agreement restricts AI tools, the plan changes: keep the boilerplate and checks, drop the AI workflow, and measure that instead.
- If maintenance of the device checks or QA agent costs more time than it saves, record it and decide in Phase 3 whether to keep them as modules or remove them.

## Risks and open items

- **Sentry and store release** are out of scope for the pilot. If the client needs a store release inside the window, the Apple and Google accounts and Mobiweb's security approval become blockers.
- **One project is one data point.** Treat the decision as "worth continuing", not as proof.
- **Unknown:** client name, start date, walkthrough date, who else reviews diffs.

## Needed from the owner

The client's name and start date, the walkthrough date, and answers to the client-agreement and cross-model questions.
