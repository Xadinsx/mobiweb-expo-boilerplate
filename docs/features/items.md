# Items

Status: in use (sample feature)

## What it does

The sample app shows a list of items. Tapping an item opens its detail. It exists to give the tests, the device checks and the QA agent something real to run against, and to show how a feature is structured.

## Behavior

- The list shows every item by its title. An empty list shows a "No items to show" message (translated), not a blank screen.
- Tapping a row opens the detail, which shows the item's title and description.
- Opening the detail of an id that does not exist sends the user back to the list.
- The data is local and fixed; nothing is fetched.

## Screens and routes

| Route | Page | What the user sees |
|---|---|---|
| `/` | `pages/items` | The list of items |
| `/item/<id>` | `pages/item-detail` | The title and description of one item |

## Code

- `src/entities/item` holds the `Item` type, the data, and the `ItemDetail` view. Its `api` folder is the path data will come through: the backend's item shape and the mapper to `Item`, an in-memory mock source (the default) and an HTTP source for a real backend. The pages do not use it yet.
- `src/pages/items` holds the list page and its `ItemsList` component.
- `src/pages/item-detail` reads the id from the route and shows the item.
- The route files in `app/` re-export the pages.
- Test ids: `items-main-list`, `items-row-<id>-button`, `items-empty-text`, `items-settings-link`, `detail-title-text`, `detail-description-text`.
- The header also has a link to [Settings](settings.md).

## Tests

- `src/app/routes.test.tsx`: the list, opening a detail, an unknown id, and the test id convention.
- `src/pages/items/ui/ItemsList.test.tsx`: the empty state.
- `.maestro/flows/items-list-to-detail.yml`: the same flow on an Android emulator, run by `maestro-android` in CI.

## Decisions

- Structure: [ADR 0001](../adr/0001-feature-sliced-design.md).

## Limits

This is a sample feature, kept as the reference for how a feature is structured (slice, page, route, tests, device flow). A client project replaces it with its first real feature, and rewrites the Maestro flow in `.maestro/flows`, the `qa-notes.md` of its vendors, and this doc to match. The items are hard-coded for now; the `api` folder shows how a backend connects.
