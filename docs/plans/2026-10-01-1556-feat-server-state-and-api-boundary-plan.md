---
title: Server State and API Boundary - Plan
type: feat
date: 2026-10-01
topic: server-state-and-api-boundary
artifact_contract: ce-unified-plan/v1
product_contract_source: ce-brainstorm
execution: code
---

# Server State and API Boundary - Plan

## Goal Capsule

- **Objective:** A project built from the boilerplate loads its data through one typed, tested path with visible loading and error states, so a project's first real endpoint is a short addition and a client can decline the library.
- **Product authority:** The requirements and key decisions below. Persisting the query cache, authentication, mutations, pagination and query devtools are not active scope.
- **Open blockers:** None.
- **Stop conditions:** Stop and report when a unit's verification fails twice for the same reason, or when the existing Maestro flow cannot pass without changing what the user sees on success.
- **Execution profile:** Code. Three sequential pull requests, each opened after the previous one has merged to `main`.

## Product Contract

### Summary

Add a server-state module: TanStack Query and a typed API layer, with the items list and item detail loading through it. The sample app uses an in-app mock that answers the same interface, so CI, Maestro and the QA agent work offline. A small tested HTTP client that reads the vendor's `apiBaseUrl` ships beside it for projects that have a backend.

### Problem Frame

The items are a hard-coded array that both pages import directly, and each vendor's `backend.apiBaseUrl` is read nowhere. A project with a real backend would invent its own client, error handling and loading screens, differently each time, on top of a sample that shows none of it. The boilerplate has to work without a backend, because the emulator checks run with none.

### Key Decisions

- **The sample app gets its data from an in-app mock behind the client's interface.** (session-settled: user-directed — chosen over a real HTTP call with a fake server in tests and over a per-vendor choice: the emulator checks have no backend, and a vendor switch adds a setting and a code path for every vendor.) Governs R4.
- **The sample screens show loading, an error with Retry, and the empty message.** (session-settled: user-directed — chosen over loading and empty only and over docs only: the error path is the part projects get wrong, and a piece nothing exercises rots.) Governs R6, R7.
- **The module ships a small tested HTTP client.** (session-settled: user-directed — chosen over shipping only the interface and the mock: the vendor's `apiBaseUrl` would stay unused and every project would invent its own failure handling.) Governs R3, R5.
- **It is a normal module.** TanStack Query is the recommended default, and declining it is a deviation, like the other modules. Governs R9.

### Requirements

**Data layer**

- R1. The app reads and caches server data through TanStack Query, set up once for the whole app.
- R2. Each resource has one API interface. The sample's resources are the list of items and one item by id. A response arrives in the backend's own shape, and a mapper turns it into the app's `Item`.
- R3. Every failure (no network, an HTTP error status, a malformed response) reaches the screens as one error type that says which of the three it was.
- R4. The sample uses an in-app mock that answers the same interface, needs no network, and returns the existing three items.
- R5. A small HTTP client implements the same interface from the vendor's `backend.apiBaseUrl`. Unit tests cover it, and the sample does not use it.

**Sample screens**

- R6. The items list shows a loading indicator while loading, a translated error message with a Retry button when the request fails, the existing empty message when there are no items, and the list otherwise.
- R7. The item detail loads its item by id with the same loading and error treatment. An id that does not exist sends the user back to the list, as today.
- R8. New text is translated in every shipped language, and new elements carry test ids that follow the convention in `docs/ai/house-style.md`.

**Module**

- R9. The capability has a manifest in `docs/modules` in the usual shape (recommended default and why, what it adds, where the app depends on it, swap and removal steps, rules, leftover checks), an entry in the module index, and an ADR that records the choice.
- R10. The items feature doc describes the new data path, and every new piece is used by the sample app or its tests.

### Acceptance Examples

- AE1. **Covers R6.** Given the items request fails, when the list opens, then the error message and a Retry button show; pressing Retry loads again, and on success the list shows.
- AE2. **Covers R7.** Given no item has id 99, when the detail for 99 opens, then the user lands on the list.
- AE3. **Covers R3.** Given the HTTP client meets a dropped connection, a 500 response, and a response that is not valid items, then each reaches the screens as the same error type with a different kind.
- AE4. **Covers R4.** Given an emulator with no backend, when the app starts, then the list and a detail screen show their items, and the existing Maestro flow passes unchanged.
- AE5. **Covers R9.** Given a project declines TanStack Query through the module skill, when the skill finishes, then no query-library import is left, a deviation ADR exists, and the checks pass.

### Success Criteria

- The existing Maestro flow and QA agent notes still hold with no change to what a user sees when loading succeeds.
- Unit tests show the loading, error, Retry, empty and unknown-id behaviors, and the HTTP client's three failure kinds.
- A rehearsal of the module skill declining the library ends green.

### Scope Boundaries

**Deferred for later**

- Persisting the query cache so the app opens with its last data offline.
- Authentication, mutations and optimistic updates, pagination, and query devtools.

**Outside this work**

- Choosing or building a backend for any client.

### Dependencies / Assumptions

- Verified in the repo: the items are a constant in `src/entities/item/model/item.ts`, both pages import it, and `backend.apiBaseUrl` is declared in `src/shared/config/vendor/vendor-config.ts` and read by no source file.
- The Maestro flow `.maestro/flows/items-list-to-detail.yml` and the QA notes in `vendors/*/qa-notes.md` describe the success path only, so they should not need changes.

### Outstanding Questions

**Deferred to Planning**

- Where the query client is created and provided, and where the mock and the HTTP client sit in the Feature-Sliced layout.
- How a test makes a request fail, since the sample's mock never does.
- Default retry and staleness behavior, and whether the mock waits before answering.

### Sources / Research

- `src/pages/items/ui/ItemsList.tsx`, `src/pages/item-detail/ui/ItemDetailPage.tsx`, `src/entities/item`, `src/app/navigation/RootLayout.tsx`.
- `docs/modules/README.md` and `docs/modules/storage.md` for the manifest shape; `docs/ai/house-style.md` for the test id convention.
- `docs/plans/2026-09-29-1517-feat-ai-driven-lifecycle-plan.md`, where the stack was first listed.

---

## Planning Contract

Product Contract preservation: unchanged.

### Key Technical Decisions

- KTD1. **Three sequential pull requests.** PR 1 is U1 and U2 (the shared API layer and the item API, no visible change). PR 2 is U3 and U4 (provider, hooks, screens and their tests). PR 3 is U5 and U6 (module manifest, ADR, docs and the rehearsal). Each is opened only after the previous one has merged to `main`. Governs R1 to R10.
- KTD2. **Where things live.** `src/shared/api` holds the error type and the HTTP client, which have no business meaning. `src/entities/item/api` holds the DTO, the mapper, the two sources and the item API. `src/entities/item/model` holds the hooks, each with its own query key inline. `src/app/providers` holds the query provider. `src/shared/ui` holds the loading and error views. Each shared segment exports through an `index.ts`. Governs R1 to R6.
- KTD3. **The mock-or-HTTP choice is one line.** The item API file imports the mock source; a project with a backend changes that import to the HTTP source. There is no runtime switch and no vendor setting. Governs R4, R5.
- KTD4. **A missing item resolves to `null`.** The item API's `get(id)` resolves `null` when the item does not exist (the HTTP source maps a 404 to `null`; the mock returns `null` for an unknown id) and throws the error type for every other failure. The detail page redirects on `null`. Governs R7.
- KTD5. **One error type.** `ApiError` carries `kind` (`network`, `http` or `invalid-response`) and, for `http`, the status. The HTTP client throws it for a dropped connection and an error status; the mapper throws `invalid-response` for a body that is not valid items. Governs R3.
- KTD6. **The mock answers in the backend's shape.** It returns item DTOs from a fixture, and the same mapper that serves the HTTP source turns them into `Item`, so the boundary is exercised by the sample. It answers at once, with no delay. Governs R2, R4.
- KTD7. **Query client defaults.** The client retries once, not the library's three times with backoff, which would delay the error screen by several seconds. Page and hook tests wrap what they render in their own `QueryClientProvider` with retries off, which is the one seam for a test client. The provider creates its own client per mount. Governs R1, R6.
- KTD8. **Pages read data through hooks in the entity.** `useItems` and `useItem(id)` live in `entities/item/model`; the pages call them and pass plain data to presentational components. Governs R1, R6, R7.
- KTD9. **The loading and error views are shared.** Both pages need them and they change for the same reason, so `shared/ui` holds one loading view and one error view with a Retry button. A prefix prop gives each page its own test ids. Governs R6, R7, R8.
- KTD10. **Tests make a request fail by spying on the item API.** `jest.spyOn(itemApi, "list")` rejects with an `ApiError` at the module boundary the pages use. The HTTP client takes `fetch` as an argument so its tests need no network. Governs R3, R6.
- KTD11. **The first-load flash is accepted.** The first frame shows the loading view before the mock answers, so tests await the list. The Maestro flow already waits for the list to appear. Governs R6.
- KTD12. **The ADR is 0009.** It records TanStack Query as the recommended default and the alternatives. Governs R9.

### Considered and not built

- **`@tanstack/eslint-plugin-query`.** It catches a client created on every render and missing query-key variables. Leaving it out costs a lost cache that shows up in the first test run. Add it if a project's review keeps finding those mistakes.
- **App-focus and online-status managers** (`focusManager`, `onlineManager`, which need `AppState` and an extra network package). The sample has no data that goes stale while the app sleeps. Add them with the first real backend.
- **Query devtools, persistence and a shared query-key factory.** Out of the Product Contract's scope or used once.

### Assumptions

- `@tanstack/react-query` 5.104 supports React 19 (its peer range is React 18 or 19). Checked on the npm registry.
- `pnpm expo install` passes non-Expo packages through to pnpm, and the version lands in the lockfile.
- `knip` counts test files as entry points, so exports used only by tests are not reported. Confirmed at execution by running it.

### Risks & Dependencies

- **Synchronous tests.** `routes.test.tsx` reads list and detail content on the first frame. Mitigation: U4 converts it to await the content and keeps its assertions. `ItemsList.test.tsx` passes its items as a prop, so it is unaffected.
- **Act warnings.** Query updates outside a render can print React `act` warnings in Jest. Mitigation: tests await with `findBy`/`waitFor` and use a client with `retry: false`.
- **Device checks.** A loading frame now precedes the list on the emulator. Mitigation: the Maestro flow waits for `items-main-list`, and CI runs it in PR 2.
- **Dependencies.** None on other open work; PR 2 needs PR 1 merged, and PR 3 needs PR 2 merged.

---

## Implementation Units

### U1. Shared API layer

- **Goal:** One error type and a small HTTP client that turns every failure into it.
- **Requirements:** R3, R5.
- **Dependencies:** None.
- **Files:** `src/shared/api/index.ts`, `src/shared/api/api-error.ts`, `src/shared/api/http-client.ts`, `src/shared/api/http-client.test.ts`.
- **Approach:**
  - `ApiError` carries `kind` and an optional `status`.
  - `createHttpClient(baseUrl, fetchFn)` returns an object with a JSON `get(path)` that resolves the parsed body.
  - A rejected fetch throws `network`; a non-OK response throws `http` with the status; a body that is not JSON throws `invalid-response`. A 404 stays an `http` error here; the item source turns it into `null` (KTD4).
  - The client reads no global state: the base URL and `fetch` come in as arguments (KTD10).
- **Patterns to follow:** `src/shared/lib/storage` for a shared segment with a public `index.ts`.
- **Test scenarios:**
  - Covers AE3. A fetch that rejects throws `ApiError` with kind `network`.
  - Covers AE3. A 500 response throws `ApiError` with kind `http` and status 500.
  - Covers AE3. A 200 response whose body is not JSON throws kind `invalid-response`.
  - Happy path: a 200 JSON response resolves the parsed body and requests `baseUrl` joined with the path.
  - Edge case: a base URL with a trailing slash and a path with a leading slash produce one slash between them.
- **Verification:** The five scenarios pass, and `pnpm fsd` accepts the new segment.

### U2. Item API: DTO, mapper, sources

- **Goal:** The item API answers `list` and `get` in the app's `Item` from either source, with the mock as the default.
- **Requirements:** R2, R3, R4, R5.
- **Dependencies:** U1.
- **Files:** `src/entities/item/api/item-dto.ts`, `src/entities/item/api/to-item.ts`, `src/entities/item/api/mock-item-source.ts`, `src/entities/item/api/http-item-source.ts`, `src/entities/item/api/item-api.ts`, `src/entities/item/api/index.ts`, `src/entities/item/index.ts`, `src/entities/item/api/to-item.test.ts`, `src/entities/item/api/item-api.test.ts`, `src/entities/item/api/http-item-source.test.ts`.
- **Approach:**
  - The DTO uses the backend's field names (not the app's), so the mapper has work to do (KTD6).
  - `toItem` validates the DTO's shape and throws `invalid-response` when a field is missing or the wrong type.
  - A source returns DTOs: `list()` and `get(id)`, with `get` resolving `null` for a missing item (KTD4). The mock reads a fixture of the existing three items; the HTTP source calls `/items` and `/items/<id>` on a client from `createHttpClient(vendor.backend.apiBaseUrl, fetch)`, with the global `fetch` passed in at that one call site and maps a 404 to `null`.
  - `itemApi` composes a source with `toItem`; the source import is the one line that decides mock or HTTP (KTD3).
  - The `items` constant stays exported until U4 so each commit keeps the app working.
- **Patterns to follow:** the public-API style of `src/entities/item/index.ts`.
- **Test scenarios:**
  - Happy path: `itemApi.list()` on the mock resolves the three items with the titles and descriptions the screens show today.
  - Happy path: `itemApi.get("2")` resolves "Item two".
  - Covers AE2. `itemApi.get("999")` resolves `null`.
  - Error path: `toItem` on a DTO missing a field throws `ApiError` with kind `invalid-response`.
  - Integration: the HTTP source with a faked client maps a list response to items, maps a 404 on `get` to `null`, and lets a 500 reach the caller as `http`.
- **Verification:** The scenarios pass, and `knip` reports no unused file.

### U3. Query provider and hooks

- **Goal:** The app has one query client, and the item entity offers hooks that read through the item API.
- **Requirements:** R1, R2.
- **Dependencies:** U2 (PR 1 merged).
- **Files:** `package.json`, `pnpm-lock.yaml`, `src/app/providers/QueryProvider.tsx`, `src/app/providers/index.ts`, `src/app/navigation/RootLayout.tsx`, `src/entities/item/model/use-items.ts`, `src/entities/item/model/use-item.ts`, `src/entities/item/index.ts`, `src/entities/item/model/use-items.test.tsx`.
- **Approach:**
  - Add `@tanstack/react-query` with `pnpm expo install`.
  - `QueryProvider` creates one client per mount with `retry: 1` (KTD7) and wraps the `Stack` in `RootLayout`.
  - `useItems` and `useItem(id)` wrap `useQuery` over `itemApi`, each with its query key written inline (KTD8).
  - The hooks are exported from the entity's public API.
- **Execution note:** Write the hook test first against a fresh client with `retry: false` and watch it fail.
- **Patterns to follow:** the entity public API in `src/entities/item/index.ts`; the provider placement in `src/app/navigation/RootLayout.tsx`.
- **Test scenarios:**
  - Happy path: `useItems` goes from loading to the three items.
  - Error path: with `itemApi.list` rejecting with `network`, `useItems` ends in an error whose kind is `network`.
  - Edge case: `useItem("999")` resolves `null`, not an error.
- **Verification:** The hook tests pass, and the existing app still renders with the provider in place.

### U4. Sample screens: loading, error, Retry

- **Goal:** The list and the detail load through the hooks and show the right state for each outcome.
- **Requirements:** R6, R7, R8, R10.
- **Dependencies:** U3.
- **Files:** `src/shared/ui/LoadingState.tsx`, `src/shared/ui/ErrorState.tsx`, `src/shared/ui/ErrorState.styles.ts`, `src/shared/ui/LoadingState.styles.ts`, `src/shared/ui/index.ts`, `src/pages/items/ui/ItemsPage.tsx`, `src/pages/item-detail/ui/ItemDetailPage.tsx`, `src/shared/config/i18n/resources.ts`, `src/entities/item/model/item.ts`, `src/entities/item/index.ts`, `src/app/routes.test.tsx`, `src/pages/items/ui/ItemsPage.test.tsx`, `src/pages/item-detail/ui/ItemDetailPage.test.tsx`.
- **Approach:**
  - `LoadingState` shows an activity indicator and a translated text; `ErrorState` shows a translated message and a Retry button that calls the query's refetch. Both take a test id prefix (KTD9) and follow the `<screen>-<element>-<role>` convention, for example `items-loading-text`, `items-error-text`, `items-retry-button`.
  - `ItemsPage` calls `useItems` and chooses loading, error, or the existing list (which keeps its own empty message). `ItemDetailPage` calls `useItem` and redirects to the list on `null`.
  - Add the new keys to English and Portuguese in `resources.ts`.
  - Remove the `items` constant and its export; every caller is in this repo.
  - Convert `routes.test.tsx` to await the content, keeping what it asserts.
- **Execution note:** Add the failing page tests (error then Retry, loading, unknown id) before the screens, and watch them fail.
- **Patterns to follow:** `src/pages/items/ui/ItemsList.tsx` and its `*.styles.ts` for the theme-based styles; `docs/ai/house-style.md` for test ids.
- **Test scenarios:**
  - Happy path: the list page shows a loading text, then the three items.
  - Covers AE1. With `itemApi.list` rejecting, the page shows the error text and the Retry button; after the spy resolves and Retry is pressed, the list shows.
  - Edge case: with `itemApi.list` resolving `[]`, the existing empty message shows.
  - Covers AE2. The detail route for `999` ends on the list.
  - Happy path: the detail for `2` shows the title and description after loading.
  - Integration: the routes test still opens a detail from the list and reaches settings.
  - Edge case: with the Portuguese language set, the loading and error texts are Portuguese.
- **Verification:** Every page and route test passes, `pnpm typecheck` accepts the new i18n keys, and `maestro-android` passes unchanged on the pull request.

### U5. Module manifest, ADR and docs

- **Goal:** The capability is documented as a module a project can keep, swap or decline.
- **Requirements:** R9, R10.
- **Dependencies:** U4.
- **Files:** `docs/modules/server-state.md` (new), `docs/modules/README.md`, `docs/adr/0009-server-state-with-tanstack-query.md` (new), `docs/adr/README.md`, `docs/features/items.md`, `docs/vendors.md`.
- **Approach:**
  - Write the manifest in the usual shape. Recommended default: TanStack Query, with the reason. Where the app depends on it: `@tanstack/react-query` imports, `QueryProvider`, `useQuery` in the hooks. Swap and removal: the hooks return plain data from `itemApi` directly with local loading state, or another library behind the same hooks. Rules: components never fetch; data enters through the item API and its mapper; one error type; the mock-or-HTTP choice is the single import in `item-api.ts`. Checks: the page and hook tests. Leftover searches for a removal.
  - The ADR records the choice and the alternatives (no library with `fetch` in effects, SWR, RTK Query).
  - `docs/features/items.md`: the data now arrives through the item API, the loading and error behavior, and the updated list of tests and test ids; the "hard-coded" limit is replaced by how a project connects its backend.
  - `docs/vendors.md`: one line saying `backend.apiBaseUrl` is read by the HTTP source.
- **Patterns to follow:** `docs/modules/storage.md` and `docs/modules/package-manager.md`.
- **Test scenarios:**
  - Test expectation: none -- documentation. Proven by U6.
- **Verification:** Every file and script the module touches appears in the manifest's patterns, and the index and ADR index list the new entries.

### U6. Rehearse declining the library

- **Goal:** The module skill can remove the library from a copy and leave a green project.
- **Requirements:** R9, AE5.
- **Dependencies:** U5.
- **Files:** `docs/ai/token-discipline.md`, and any manifest or skill text the run shows to be wrong.
- **Approach:**
  - On a throwaway copy of the PR 3 branch, run `/module` to remove TanStack Query, with the confirmations given in the prompt (headless runs cannot approve deletes or edits under `.claude/`).
  - Check no `@tanstack` import is left, a deviation ADR exists, and the checks pass; fix manifest text that misled the run; add the cost to the token record.
- **Execution note:** Plant a stale mention of the library in a file the manifest does not list, to see whether the skill finds it.
- **Test scenarios:**
  - Covers AE5. After the run, the manifest's leftover searches return nothing, the planted mention is gone, a deviation ADR exists, and lint, typecheck, tests, Steiger and `knip` pass.
- **Verification:** The rehearsal ends green and its cost is recorded.

---

## Verification Contract

| Check | Command or evidence | Applies to |
|---|---|---|
| Types | `pnpm typecheck` (also checks the i18n keys) | U1 to U6 |
| Lint | `pnpm lint` | U1 to U6 |
| Unit tests | `pnpm test` | U1 to U4 |
| Architecture | `pnpm fsd` (new `shared/api` and `shared/ui` segments) | U1 to U4 |
| Dead code | `pnpm dead-code` | U1 to U4 |
| Isolation | `pnpm vendor-isolation` | U2 to U4 |
| Device flows | `maestro-android` and `qa-agent` green on PR 2, Maestro flow unchanged | U3, U4 |
| Skill rehearsal | `/module` removes the library on a scratch copy and ends green | U6 |

## Definition of Done

- Each unit's verification passes on a real branch and pull request, or in the throwaway-copy rehearsal for U6.
- R1 to R10 trace to a unit: R1 to U3; R2 to U2; R3 to U1 and U2; R4 to U2; R5 to U1 and U2; R6 to U4; R7 to U2 and U4; R8 to U4; R9 to U5 and U6; R10 to U4 and U5.
- The `items` constant is gone, the pages read through the hooks, and the existing Maestro flow passes unchanged.
- Every new piece is used by the sample app or its tests, and `knip` is clean.
- Abandoned or experimental code from trials is removed from the diff.
