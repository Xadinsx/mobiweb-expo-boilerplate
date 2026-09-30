#!/usr/bin/env bash
# Runs the Maestro flows every vendor has, plus the ones only the vendor under test has.
# Needs APP_VARIANT (the vendor) and APP_ID (its Android package). Its own file because the
# emulator action runs a script one line at a time.
set -euo pipefail

flows=(.maestro/flows)
if [ -d "vendors/$APP_VARIANT/maestro" ]; then
  flows+=("vendors/$APP_VARIANT/maestro")
fi

maestro test -e APP_ID="$APP_ID" "${flows[@]}" --format junit --output maestro-report.xml
