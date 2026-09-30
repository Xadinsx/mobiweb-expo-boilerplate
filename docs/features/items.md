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

- `src/entities/item` holds the `Item` type, the data, and the `ItemDetail` view.
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

The items are hard-coded. A real project replaces them with data from an API.
