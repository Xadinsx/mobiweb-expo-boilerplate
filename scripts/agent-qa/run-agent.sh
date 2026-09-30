#!/usr/bin/env bash
# Runs Claude Code as the QA agent. It may only run `agent-device` commands, ignores the
# repository's own Claude settings, and stops at 40 turns or $0.50 of model cost.
set -uo pipefail

claude -p \
  --model haiku \
  --max-turns 40 \
  --max-budget-usd 0.50 \
  --output-format json \
  --no-session-persistence \
  --setting-sources user \
  --strict-mcp-config \
  --tools Bash \
  --allowedTools 'Bash(agent-device:*)' \
  --append-system-prompt-file scripts/agent-qa/instructions.md \
  < qa-input.txt > qa-claude-output.json 2> qa-claude-error.log

echo "claude exit code: $?" >> qa-claude-error.log
exit 0
