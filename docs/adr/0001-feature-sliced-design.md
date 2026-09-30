# 0001. Feature-Sliced Design with routes in a root `app/` folder

- Status: accepted
- Date: 2026-09-30

## Context

The code should stay simple and readable as the app grows, and an AI agent should not be free to invent a structure. That needs a known architecture with rules a tool can check. The sample app started as one `features/items` folder with no rules about what may import what.

Expo Router turns the files in one folder into routes. It uses `src/app` if that folder exists, and `app` otherwise. Feature-Sliced Design (FSD) also has a layer called `app`, which normally sits at `src/app`, and its linter Steiger does not support renaming layers.

## Decision

Use FSD and enforce it with Steiger (`npm run fsd`, part of the `checks` job).

- Layers, from top to bottom: `app`, `pages`, `widgets`, `features`, `entities`, `shared`. A layer may import only from layers below it, and slices on the same layer never import each other.
- Add layers on demand. Today the repo has `app`, `pages` and `entities`; `widgets`, `features` and `shared` appear when the first real need does.
- Expo Router's routes live in a root `app/` folder and only re-export a page (`export { ItemsPage as default } from "@/pages/items"`). Screens and logic live in `src/pages`. The setting `extra.router.root` (through the `expo-router` plugin option `root`) points Expo Router at `app/`, so `src/app` is free for FSD's app layer.
- Every slice exposes a public API through its `index.ts`. Other code imports the slice, never its internals.

## Alternatives

- **Keep plain feature folders.** Simplest, but nothing stops the structure from drifting, and there is no linter to say where new code goes.
- **Features and shared only.** Less ceremony, but cross-feature code has no home and the rules are ours to invent and enforce.
- **Routes in `src/app`, no FSD app layer.** Works with Expo Router alone, but mixes routing files with app-wide setup and gives up the standard layer.

## Consequences

- New code has a predictable place, and Steiger fails a PR that breaks the import rules.
- There are more folders than a tiny app needs. Layers and slices are added only with a real second use, following the abstraction rule in `docs/ai/house-style.md`.
- The route folder is outside `src`, so route files are one-line re-exports and need no tests of their own; `src/app/routes.test.tsx` tests the routes end to end.
- Upgrading Expo Router or Steiger may change these conventions, so re-check this ADR then.
