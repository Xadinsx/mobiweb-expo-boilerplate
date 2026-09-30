# 0003. Device tests on GitHub Actions, not EAS Workflows

- Status: accepted
- Date: 2026-09-30

## Context

The plan was to run Maestro on EAS Workflows. EAS runs Maestro jobs only on a paid plan. On the free plan the first run silently skipped Maestro and reported success, and the next run failed to start the job.

## Decision

Run device checks as GitHub Actions jobs. `maestro-android` generates the Android project, builds the release APK for x86_64 from the PR's code, boots an emulator and runs `.maestro/flows`. A `changes` job skips it for PRs that cannot affect the app. iOS is not tested on a device yet.

## Alternatives

- Pay for an EAS plan: works with the existing workflow, but costs money for a check that runners do for free.
- Download an EAS build in the job: needs an Expo token in GitHub and waits on EAS's queue.
- Skip Maestro until later: leaves the flow untested.

## Consequences

- The job builds its own APK, so the app under test is always the PR's code, with no stale bundle.
- Each run takes about 10 to 13 minutes of runner time. The `changes` job avoids that for docs-only PRs.
- A skipped GitHub job counts as passing; `docs/ai/lifecycle.md` says how to read it.
- iOS device tests need macOS runners, which use the free minutes about ten times faster, so they wait.
