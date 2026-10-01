# Mobiweb Expo Boilerplate

Expo app (Expo Router, strict TypeScript, Jest with React Native Testing Library). The AI-assisted workflow is described in `docs/ai/`; read it before starting a ticket.

## Commands

- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm fsd`, `pnpm dead-code`: run all five before saying a task is done.
- `pnpm expo run:android` or `pnpm expo run:ios`: build and start a development app. Expo Go does not work, because the app has native modules; afterwards `pnpm expo start` opens the dev server.
- `pnpm expo install <package>`: always use this to add dependencies, so versions match the Expo SDK.
- A pre-push hook (`.githooks/pre-push`, installed by `pnpm install`) runs the five checks before every push. Never skip it with `--no-verify`; fix the failure instead.
- Node comes from `.nvmrc` and pnpm from the `packageManager` field in `package.json` (run `corepack enable` once). Commit `pnpm-lock.yaml` with any dependency change; CI installs with a frozen lockfile and fails when it is out of date.

## Layout

Feature-Sliced Design, checked by `pnpm fsd`. The layout rules are in `docs/modules/architecture.md`.

- `app/` (repo root): Expo Router routes. One-line re-exports of a page, no logic.
- `src/app`, `src/pages`, `src/entities`, `src/shared`, ...: FSD layers. Import only from lower layers, and only through a slice's `index.ts`. Add a layer or slice only when a real second use appears.
- No `ios/` or `android/` folders: native code is generated. Configure native behavior in `app.config.ts` (fed by the vendor config, see `docs/vendors.md`) and config plugins.

## Rules

- Write the simplest code that works and match the surrounding code. Follow `docs/ai/house-style.md`, especially the search-before-write rule and the abstraction rule.
- Expo, EAS, and React Native APIs change between SDK versions. Check `https://docs.expo.dev/versions/v57.0.0/` before writing code that uses them.
- Every interactive element gets a `testID` and an accessibility label, named as `docs/ai/house-style.md` describes.
- Once the team uses Jira (repo variable `REQUIRE_TICKET_KEY` is `true`), branch names and PR titles start with the Jira ticket key. Until then, use short descriptive names.
- Commit messages follow Conventional Commits, as in `feat(items): add a filter`. When you change a feature, update its doc in `docs/features/`, and record a weighed decision as an ADR in `docs/adr/`. See `docs/ai/docs-workflow.md`.
- Never read, print, or commit secrets, `.env` files, or client data. Report suspected exposure to information.security@celfocus.com.
- Do not read `node_modules`, build output, or lockfiles. Search with targeted patterns and read file ranges, not whole directories.

## Docs

- `docs/ai/house-style.md`: code style, when to abstract, `testID` convention.
- `docs/modules/README.md`: the capabilities (styling, storage, translations, architecture check, device checks, QA agent), their recommended defaults, and their rules. Read the manifest before changing what it covers. A client can decline a default through a deviation ADR.
- `docs/ai/token-discipline.md`: how to keep token use low.
- `docs/ai/docs-workflow.md`: commits, feature docs, ADRs, and the docs check.
- `docs/features/`: what each feature does today.
- `docs/adr/`: why the important decisions were made.
- `docs/plans/`: plans for larger work.
