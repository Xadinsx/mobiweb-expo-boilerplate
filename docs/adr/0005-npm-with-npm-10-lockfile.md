# 0005. npm as the package manager, lockfile written by npm 10

- Status: superseded by 0008
- Date: 2026-09-29

## Context

Expo and EAS work with npm without extra setup. CI uses Node 22, which bundles npm 10, while developer machines may have npm 11. A lockfile written by npm 11 once made `npm ci` fail in CI with "Missing: typescript@5.9.3 from lock file". Another time a developer's private registry mirror ended up in the lockfile and CI could not authenticate against it.

## Decision

Use npm. Change dependencies with `npx expo install <package>`, and regenerate the lockfile with `npx npm@10 install` when your npm is newer than 10. The lockfile must point at `registry.npmjs.org`.

## Alternatives

- pnpm, yarn or bun: faster installs, but extra setup and less common in Expo tooling and docs.
- Pin npm 11 in CI: works, but one more step in every workflow.

## Consequences

- The lockfile is reproducible across npm versions, and CI catches a mismatch.
- Developers behind a private registry must check the lockfile for mirror URLs before committing.
