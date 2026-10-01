# Items

Status: in use (sample feature)

## What it does

The sample app shows a list of items. Tapping an item opens its detail. It exists to give the tests, the device checks and the QA agent something real to run against, and to show how a feature is structured.

## Behavior

- The list shows every item by its title. An empty list shows a "No items to show" message (translated), not a blank screen.
- Tapping a row opens the detail, which shows the item's title and description.
- Opening the detail of an id that does not exist sends the user back to the list.
- While an item or the list loads, a "Loading..." text with a spinner shows. If loading fails, a translated error message with a Retry button shows, and pressing Retry loads again. Both texts are translated.
- The data comes from an in-memory mock that needs no network, so it shows at once. The mock stands in for a backend; see the Limits.

## Screens and routes

| Route | Page | What the user sees |
|---|---|---|
| `/` | `pages/items` | The list of items |
| `/item/<id>` | `pages/item-detail` | The title and description of one item |

## Code

- `src/entities/item` holds the `Item` type, the data, and the `ItemDetail` view. Its `api` folder is the path data comes through: the backend's item shape and the mapper to `Item`, an in-memory mock source (the default) and an HTTP source for a real backend. Its `model` folder has the `useItems` and `useItem` hooks that read through it with TanStack Query.
- `src/pages/items` holds the list page, which picks loading, error or the `ItemsList` component.
- `src/pages/item-detail` reads the id from the route and shows the item, the loading and error views, or sends the user to the list.
- `src/shared/ui` holds the loading and error views both pages use, and `src/app/server-state` holds the query provider.
- The route files in `app/` re-export the pages.
- Test ids: `items-main-list`, `items-row-<id>-button`, `items-empty-text`, `items-loading-text`, `items-error-text`, `items-retry-button`, `items-settings-link`, `detail-title-text`, `detail-description-text`, `detail-loading-text`, `detail-error-text`, `detail-retry-button`.
- The header also has a link to [Settings](settings.md).

## Tests

- `src/app/routes.test.tsx`: the list, opening a detail, an unknown id, and the test id convention.
- `src/pages/items/ui/ItemsList.test.tsx`: the empty state of the list component.
- `src/pages/items/ui/ItemsPage.test.tsx` and `src/pages/item-detail/ui/ItemDetailPage.test.tsx`: loading, error then Retry, the empty message, an unknown id, and Portuguese text. They make a request fail by spying on the item API.
- `src/entities/item/model/use-items.test.tsx` and the tests in `src/entities/item/api` and `src/shared/api`: the hooks, the mapper, the sources and the HTTP client.
- `.maestro/flows/items-list-to-detail.yml`: the same flow on an Android emulator, run by `maestro-android` in CI.

## Decisions

- Structure: [ADR 0001](../adr/0001-feature-sliced-design.md).
- Server data: TanStack Query through the item API (the module manifest and ADR follow in the next change).

## Limits

This is a sample feature, kept as the reference for how a feature is structured (slice, page, route, tests, device flow). A client project replaces it with its first real feature, and rewrites the Maestro flow in `.maestro/flows`, the `qa-notes.md` of its vendors, and this doc to match. The sample runs on the in-memory mock. To connect a backend, give `createItemApi` the HTTP source built from the vendor's `backend.apiBaseUrl` instead of the mock, as the comment in `src/entities/item/api/item-api.ts` shows. The Maestro flow and the QA agent only reach the success path, because the mock never fails; the error and Retry screens are covered by unit tests.
