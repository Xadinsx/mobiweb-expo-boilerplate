# Mobiweb Expo Boilerplate

Expo app (Expo Router, strict TypeScript, Jest with React Native Testing Library). The AI-assisted workflow is described in `docs/ai/`; read it before starting a ticket.

## Commands

- `npm run typecheck`, `npm run lint`, `npm test`, `npm run fsd`, `npm run dead-code`: run all five before saying a task is done.
- `npx expo start`: dev server.
- `npx expo install <package>`: always use this to add dependencies, so versions match the Expo SDK.
- Node 22 ships npm 10, which is what CI uses. If your npm is newer, regenerate the lockfile with `npx npm@10 install` before committing dependency changes, or `npm ci` can fail in CI with a lockfile mismatch.

## Layout

Feature-Sliced Design, checked by `npm run fsd`. Details in `docs/ai/house-style.md`.

- `app/` (repo root): Expo Router routes. One-line re-exports of a page, no logic.
- `src/app`, `src/pages`, `src/entities`, `src/shared`, ...: FSD layers. Import only from lower layers, and only through a slice's `index.ts`. Add a layer or slice only when a real second use appears.
- No `ios/` or `android/` folders: native code is generated. Configure native behavior in `app.json` and config plugins.

## Rules

- Write the simplest code that works and match the surrounding code. Follow `docs/ai/house-style.md`, especially the search-before-write rule and the abstraction rule.
- Expo, EAS, and React Native APIs change between SDK versions. Check `https://docs.expo.dev/versions/v57.0.0/` before writing code that uses them.
- Every interactive element gets a `testID` and an accessibility label, named as `docs/ai/house-style.md` describes.
- Once the team uses Jira (repo variable `REQUIRE_TICKET_KEY` is `true`), branch names and PR titles start with the Jira ticket key. Until then, use short descriptive names.
- Never read, print, or commit secrets, `.env` files, or client data. Report suspected exposure to information.security@celfocus.com.
- Do not read `node_modules`, build output, or lockfiles. Search with targeted patterns and read file ranges, not whole directories.

## Docs

- `docs/ai/house-style.md`: code style, when to abstract, `testID` convention.
- `docs/ai/token-discipline.md`: how to keep token use low.
- `docs/adr/`: why the important decisions were made.
- `docs/plans/`: plans for larger work.
