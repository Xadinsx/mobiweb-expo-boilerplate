# 0002. Claude Code with the Compound Engineering plugin as the AI workflow

- Status: accepted
- Date: 2026-09-29

## Context

Mobiweb wants developers and an AI agent to ship together with quality, and to document the process so anyone can follow it and token use stays in check. The team is small and needs one workflow, not several.

## Decision

Support Claude Code only. Use the Compound Engineering plugin for the stages (brainstorm, plan, work, review, simplify, compound), with three Callstack skills: `react-native-best-practices`, `react-native-testing` and `agent-device`. The plugin and settings are enabled in `.claude/settings.json`, and the rules live in `CLAUDE.md` and `docs/ai/`.

## Alternatives

- Cursor, or any agent (tool-agnostic): harder to document and to control cost.
- An own minimal workflow of Mobiweb commands and skills: fewer moving parts, but more to maintain.
- Claude Code with no workflow plugin: relies on the developer to drive every stage.

## Consequences

- The plugin is third-party code that runs with the developer's permissions, so read what it adds before relying on it.
- Each installed skill adds to context, so the list stays short.
- Other tools are out of scope; adding one means changing this ADR.
