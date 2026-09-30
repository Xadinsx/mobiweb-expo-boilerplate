---
capability: automated device tests
recommended: Maestro on GitHub Actions (Android)
why: Flows in plain YAML run the real app on an emulator, and GitHub Actions runs them on the free tier, where EAS Workflows needs a paid plan.
decision: ../adr/0003-device-tests-on-github-actions.md
---

# Device checks

## Adds

- `.github/workflows/maestro-android.yml` with its `changes` job, and `scripts/ci/run-maestro.sh`.
- Shared flows in `.maestro/flows`, and per-vendor flows in `vendors/<name>/maestro/`.
- The repository variable `REFERENCE_VENDOR` (optional) that chooses the vendor CI builds.

## Where the app depends on it

- `maestro` in `.github/workflows`, `scripts/ci`, `README.md` and `docs/ai/lifecycle.md`.
- `appId: ${APP_ID}` in every flow.
- `testID` props on interactive elements (see "Test IDs" in `docs/ai/house-style.md`); these also serve unit tests and the QA agent, so they stay if this module is removed.
- The `maestro-android` entry in the branch protection's required checks.

## On swap or removal

1. Another tool: rewrite the flows and `run-maestro.sh`, keep the `changes` job and the vendor-aware build (`APP_VARIANT`, `APP_ID`).
2. Removal: delete the workflow, `run-maestro.sh`, `.maestro/` and every `vendors/*/maestro/`; remove `maestro-android` from the required checks; update `docs/ai/lifecycle.md` and the README.

## Rules

- A flow that every vendor has goes in `.maestro/flows` and uses `${APP_ID}`; one that only fits some vendors goes in that vendor's `maestro/` folder.
- A flow starts with `launchApp` and `clearState: true`, and finds elements by `testID`.

## Checks

- The `maestro-android` job on PRs that can change the app.

## Leftover checks

After removal, `grep -rni "maestro" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=plans --exclude-dir=adr` must find nothing except a deviation record, and `.maestro/` must not exist.
