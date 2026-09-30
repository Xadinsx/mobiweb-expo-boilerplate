# Architecture decision records

An ADR records one decision that was weighed: what we chose, what we rejected, and why. Write one when a choice would be expensive to reverse or when a new developer would ask "why is it done this way?". Small choices belong in the PR description.

How to add one:

1. Copy `template.md` to `NNNN-short-title.md`, using the next number.
2. Fill it in. Keep it to one page.
3. Add it to the PR that makes the decision. Do not edit an accepted ADR; write a new one that supersedes it and change the old one's status.

| ADR | Decision |
|---|---|
| [0001](0001-feature-sliced-design.md) | Feature-Sliced Design with routes in a root `app/` folder |
| [0002](0002-claude-code-with-compound-engineering.md) | Claude Code with the Compound Engineering plugin as the AI workflow |
| [0003](0003-device-tests-on-github-actions.md) | Device tests on GitHub Actions, not EAS Workflows |
| [0004](0004-qa-agent-claude-code.md) | The QA agent is Claude Code driving agent-device |
| [0005](0005-npm-with-npm-10-lockfile.md) | npm as the package manager, lockfile written by npm 10 |
| [0006](0006-theming-storage-and-translations.md) | Unistyles, MMKV and i18next for theming, storage and translations |
