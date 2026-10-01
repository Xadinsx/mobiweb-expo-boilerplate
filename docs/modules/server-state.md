---
capability: server state and API access
recommended: TanStack Query v5 with a typed API layer
why: It caches, shares and retries requests, and gives every screen the same pending, error and success states, so a project's first real endpoint is a short addition. The cost is a dependency, and tests that render a screen must supply their own client.
decision: ../adr/0009-server-state-with-tanstack-query.md
---

# Server state and API access

## Adds

- Dependency `@tanstack/react-query`.
- `src/shared/api`: `ApiError` (kind `network`, `http` or `invalid-response`, and the status for `http`) and `createHttpClient(baseUrl, fetch)`.
- `src/entities/item/api`: the backend's item shape, the mapper to `Item`, an `ItemSource` interface with an in-memory mock (the default) and an HTTP source, and `itemApi`.
- `src/entities/item/model`: the `useItems` and `useItem(id)` hooks.
- `src/app/server-state`: `QueryProvider`, mounted in `RootLayout`.
- `src/shared/ui`: `LoadingState` and `ErrorState` (with Retry), and the `request.*` texts in `src/shared/config/i18n/resources.ts`.
- Tests next to each piece, and the pages' loading, error and Retry tests.

## Where the app depends on it

Search for each; a swap or removal must handle every hit.

- `@tanstack/react-query` in `package.json`, `src/app/server-state`, the two hooks, and the tests that wrap a screen (`ItemsPage.test.tsx`, `ItemDetailPage.test.tsx`, `use-items.test.tsx`).
- `QueryProvider` in `src/app/navigation/RootLayout.tsx`.
- `useItems` and `useItem` in `src/pages/items/ui/ItemsPage.tsx` and `src/pages/item-detail/ui/ItemDetailPage.tsx`, which read `data`, `isError`, `isFetching` and `refetch` from them.
- `ApiError` and `createHttpClient` from `@/shared/api`, and `itemApi` from `@/entities/item`.
- `LoadingState` and `ErrorState` from `@/shared/ui`, and the `request.` keys in `resources.ts`.
- `backend.apiBaseUrl` in `vendors/*/vendor.json`, read when a project builds the HTTP source (see the comment in `src/entities/item/api/item-api.ts`).

## On swap or removal

Only the hooks, the provider and the tests touch the query library; the API layer and the views do not.

To swap for another library such as SWR:

1. Rewrite the two hooks over the new library so they still return `data`, `isError`, `isFetching` and `refetch` (and `null` from `useItem` for a missing item).
2. Replace `QueryProvider` with the new library's provider, or remove it if it needs none, and update `RootLayout`.
3. Replace the client wrapper in the three tests that use one, keeping the settings that stop timers outliving the test.
4. Swap the dependency.

To remove the library:

1. Rewrite the two hooks as plain hooks with local state (a loading flag, the data, an error, and a function that runs the request again) that return the same four fields. The pages and the views then need no change.
2. Delete `src/app/server-state` and unwrap `RootLayout`.
3. Remove the client wrapper from the three tests that use one.
4. Remove the dependency and run the install so the lockfile updates.
5. Update `docs/features/items.md`.

The API layer (`shared/api`, `entities/item/api`) stays in both cases: it does not depend on the library.

## Rules

- A component never fetches. Data enters through the entity's API and comes out of a hook in the entity's `model` folder; a page reads the hook and passes plain data to presentational components.
- A backend response is mapped to the app's type in the entity's `api` folder, and a body of the wrong shape is an `ApiError` of kind `invalid-response`. Every failure reaches the screens as `ApiError`.
- Which source answers (mock or HTTP) is decided in one place, `src/entities/item/api/item-api.ts`. A project with a backend passes `createHttpItemSource(createHttpClient(vendor.backend.apiBaseUrl, fetch))` there. There is no runtime switch.
- Every screen that loads data shows a loading view and an error view with Retry from `shared/ui`, with a test id prefix that follows the `<screen>-<element>-<role>` convention.
- A test that renders a screen wraps it in its own `QueryClientProvider` with `retry: false` and `gcTime: Infinity`, and makes a request fail by spying on the entity's API.
- A new resource adds: the backend shape and mapper, a source method for the mock and the HTTP source, an API method, a hook, and the loading and error handling on its page.

## Checks

- The hook tests and the loading, error and Retry tests of the two pages, in `pnpm test`.
- `pnpm typecheck` (the `request.*` texts are type-checked in every language), `pnpm fsd` and `pnpm dead-code`.

## Leftover checks

After removing the library, these must find nothing:

- `rg -n "@tanstack" -g '!docs/adr/*' -g '!docs/plans/*' -g '!docs/modules/server-state.md' -g '!docs/modules/README.md' -g '!pnpm-lock.yaml' .`
- `src/app/server-state` must not exist, and `QueryClientProvider` must not appear in `src`.

After swapping, the same search must find nothing for the old library's name.
