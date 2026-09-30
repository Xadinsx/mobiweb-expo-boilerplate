---
capability: enforced code architecture
recommended: Feature-Sliced Design checked by Steiger
why: A fixed layer and slice layout keeps a growing app navigable and stops layers importing each other in a tangle; Steiger makes it a gate and not a convention.
decision: ../adr/0001-feature-sliced-design.md
---

# Architecture check

## Adds

- Dev dependencies `steiger` and `@feature-sliced/steiger-plugin`, `steiger.config.mjs`, the script `npm run fsd`, and the `npm run fsd` step in the `checks` job.
- The layout: `src/{app,pages,entities,shared}` (more layers on demand) and thin routes in the root `app/` folder.
- The path alias `@/*` in `tsconfig.json`, `jest.config.js` and the ESLint import resolver.

## Where the app depends on it

- `steiger` in `package.json`, `steiger.config.mjs` and `.github/workflows/ci.yml`.
- `index.ts` files that are the public API of each slice and each shared segment.
- Imports written as `@/<layer>/<slice>`.
- `app/` route files that re-export a page, and `src/app/routes.test.tsx`.
- `knip.json` entries for `app/**`.

## On swap or removal

1. Another structure: replace the layout rules below and the check in one change; do not keep both.
2. Dropping the check but keeping the layout: remove the `fsd` script, the CI step and the Steiger files; the rules below then stay as guidance only, and the deviation says so.
3. Dropping the layout: flatten or reorganise with the alias kept, update `knip.json`, the route re-exports, and the file-placement rules in `CLAUDE.md`.

## Rules

- **Layers**, from top to bottom: `app`, `pages`, `widgets`, `features`, `entities`, `shared`. Code may import only from layers below its own. Slices on the same layer never import each other.
- **Add layers only when needed.** The repo has the layers it uses. Create `widgets`, `features` or `shared` when the first real second use appears, not before.
- **Where does it go?**
  - A whole screen goes in `pages/<name>`.
  - A user action that several pages reuse goes in `features/<name>`.
  - A business object (its type, data access, and its row or card UI) goes in `entities/<name>`.
  - Generic code with no business meaning (UI kit, helpers, config) goes in `shared`.
  - Providers and app start-up go in `app`.
- **Segments** group code inside a slice by purpose: `ui`, `model`, `api`, `lib`, `config`. The `app` layer has no `ui` segment; its segments are named for what they hold, such as `navigation`.
- **Public API.** Every slice exports what others may use from its `index.ts`. Import another slice as `@/entities/item`, never from a file inside it. Shared segments (`config`, `lib`, `ui`, `api`) do the same: import `@/shared/config`, not a file inside it.
- **Routes** in the root `app/` folder are one-line re-exports of a page. They hold no logic.
- **Tests** sit next to the file they test (`ItemsList.test.tsx`). Route-level tests live in `src/app/routes.test.tsx`.

## Checks

- `npm run fsd` (Steiger), run in CI.

## Leftover checks

After removal, `grep -rn "steiger" . --include="package.json" --include="*.mjs" --include="*.yml" --exclude-dir=node_modules` must find nothing.
