# Onboarding: your first day with the AI workflow

Goal: ship a small first PR with Claude Code by the end of the day. Read `docs/ai/lifecycle.md` first; this page is the setup and the first-day steps.

## Set up

1. Install Node 22.12 or newer and Claude Code.
2. Clone the repo and run `npm ci`.
3. Open the repo in Claude Code. It offers the Compound Engineering plugin from `.claude/settings.json`; accept it. The plugin is third-party code that runs with your permissions, so read what it adds before relying on it.
4. Install the three Callstack skills this project uses, and no others, since every installed skill adds to context:

   ```bash
   npx skills@latest add callstackincubator/agent-skills
   ```

   Pick `react-native-best-practices`, `react-native-testing`, and `agent-device` in the picker.
5. Read `CLAUDE.md`, `docs/ai/house-style.md`, and `docs/ai/token-discipline.md`. Together they take about ten minutes.

## First day

1. Take a small ticket and create a branch named `<TICKET-KEY>-short-name`.
2. Start a fresh Claude Code session. For anything beyond a small fix, run `/compound-engineering:ce-plan` first.
3. Implement with `/compound-engineering:ce-work`. Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run dead-code`.
4. Run `/compound-engineering:ce-simplify-code`, then `/compound-engineering:ce-code-review`, and fix what they raise.
5. Open the PR with `/compound-engineering:ce-commit-push-pr`. Fill in "Decisions weighed" and the token total from `/cost`.
6. Address review comments. When the same comment appears twice, capture it as a rule (see below).

## When not to use the AI

- You do not understand the problem yet. Talk to the team or read the code first; a plan built on a misunderstanding is expensive to undo.
- The change involves secrets, credentials, or client data. Do it by hand and keep the data out of prompts.
- The change is one line you can type faster than you can describe.
- Cost or speed pressure tempts you to skip the simplify pass or human review. Never skip them.

## Learning loop

Repeated review comments and bugs should not repeat a third time. When a mistake shows up twice:

1. Run `/compound-engineering:ce-compound` to record what happened and why.
2. If it is a rule the agent should always follow, add one short line to `CLAUDE.md` or `docs/ai/house-style.md`. If it needs detail, link to a doc from `CLAUDE.md`.
3. Merge the rule through a normal PR so it is reviewed like code.
