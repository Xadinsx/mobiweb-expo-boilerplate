---
capability: package manager
recommended: pnpm 11 in its default isolated mode
why: A dependency can only import what it declares, so missing declarations fail early. A warm install took 12 s against npm's 21 s, and CI installs with a frozen lockfile. The cost is Corepack setup and an allow-list for dependency install scripts.
decision: ../adr/0008-pnpm-and-deferred-tooling.md
---

# Package manager

## Adds

- `packageManager` and `engines` in `package.json`, and `.nvmrc`. These pin pnpm and Node; Node is pinned for every project, so the pin stays if pnpm is swapped.
- `pnpm-lock.yaml`, and `pnpm-workspace.yaml` with the `allowBuilds` list for dependency install scripts (and `nodeLinker: hoisted` only if the Android build needs it).
- `pnpm/action-setup` and `cache: pnpm` in each workflow, and `pnpm install --frozen-lockfile` instead of `npm ci`.
- `node` and `pnpm` in the `eas.json` build profile, and `test/tooling/versions.test.ts`, which fails when `.nvmrc`, `package.json` and `eas.json` disagree.

## Where the app depends on it

- `pnpm` in `.github/workflows`, `.github/actions`, `.githooks/pre-push`, `scripts/ci/vendor-isolation.mjs` (it starts `pnpm expo export`), `README.md`, `CLAUDE.md`, `docs/ai`, `docs/vendors.md`, `docs/features` and `docs/modules`. The project skills name no package-manager commands; they point here.
- `pnpm-lock.yaml` in `.claude/settings.json` (a read deny rule), in the `changes` job filter of `maestro-android.yml` and `qa-agent.yml`, and in the diff exclusion that `qa-agent.yml` applies before it hands the diff to the agent.
- `packageManager`, `engines` and `"pnpm"` in `package.json` and `eas.json`.
- `pnpm add -g` in `qa-agent.yml`, which installs the QA tools.

## On swap or removal

To move to npm or yarn:

1. Pin the new manager in `packageManager` (npm has no Corepack pin; then keep the version in `engines` and `eas.json`) and update `test/tooling/versions.test.ts` to match.
2. Delete `node_modules` first: the pnpm layout is symlinks into a store, and another manager's installer fails on it. Then generate the new lockfile, and delete `pnpm-lock.yaml` and `pnpm-workspace.yaml`. Move the install-script allow-list to the new manager's equivalent, or accept its default.
3. In each workflow replace `pnpm/action-setup`, `cache: pnpm` and the install step. Replace `pnpm exec` and `pnpm expo` with the new manager's runner everywhere, including `scripts/ci/vendor-isolation.mjs`.
4. Update the `changes` job filters, the diff exclusion in `qa-agent.yml` and the `.claude/settings.json` deny rule to the new lockfile name.
5. Rewrite the commands in `.githooks/pre-push`, the composite action, `README.md`, `CLAUDE.md`, `docs/ai`, `docs/vendors.md`, `docs/features` and the other manifests. The project skills need no change.

If the new manager does not use isolated installs, check that `pnpm`-style missing-declaration errors are not hiding in the code: run the typecheck and a bundle export before committing.

## Rules

- Commit `pnpm-lock.yaml` with every dependency change. CI installs with a frozen lockfile and fails when it is stale.
- Add dependencies with `pnpm expo install <package>` so versions match the Expo SDK.
- Do not put a registry or credentials in a committed `.npmrc`. The lockfile has no registry URLs for registry packages.
- A dependency whose install script is needed goes in `allowBuilds` in `pnpm-workspace.yaml` with a one-line reason; otherwise it is set to `false`. A tool installed globally in CI gets `--allow-build=<name>` on the `pnpm add -g` line instead (the QA agent job does this for the Claude CLI and `agent-device`).
- Global binaries live in `$PNPM_HOME/bin` in pnpm 11, so a workflow that installs a tool globally puts that directory on the path first.
- Change the Node major or the pnpm version in `.nvmrc`, `package.json` and `eas.json` together.

## Checks

- `pnpm install --frozen-lockfile` in every workflow.
- `test/tooling/versions.test.ts`, in `pnpm test`.

## Leftover checks

After a swap away from pnpm, these must find nothing:

- `rg --hidden -n "pnpm" -g '!docs/adr/*' -g '!docs/plans/*' -g '!docs/modules/package-manager.md' -g '!docs/modules/README.md' -g '!.git' .`
- `pnpm-lock.yaml` and `pnpm-workspace.yaml` must not exist.

After adding pnpm back, `.nvmrc`, the `packageManager` field and `pnpm-lock.yaml` must exist and `test/tooling/versions.test.ts` must pass.
