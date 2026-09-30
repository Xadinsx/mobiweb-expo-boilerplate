# Settings

Status: in use (sample feature)

## What it does

A settings page where the user switches between the light and dark theme and between English and Portuguese. Both choices are remembered the next time the app starts.

## Behavior

- The page shows the vendor's logo at the top.
- The theme switch turns the dark theme on or off and applies it at once.
- The language buttons switch all app text between English and Portuguese at once. The selected language is marked.
- The first time the app starts, the language is the device language if it is Portuguese, otherwise English; the theme is light.
- Both choices are stored on the device (MMKV) under the keys `theme` and `language`.

## Screens and routes

| Route | Page | What the user sees |
|---|---|---|
| `/settings` | `pages/settings` | The theme switch and the two language buttons |

The page opens from the "Settings" link in the header of the items list.

## Code

- `src/pages/settings` holds the page and its styles; the logo comes from the vendor (`vendors/<name>/runtime.ts`).
- `src/shared/config/theme` holds the tokens, the two themes, the initial theme and `setTheme`.
- `src/shared/config/i18n` holds the translations, the initial language and `setLanguage`.
- `src/shared/lib/storage` wraps MMKV.
- Test ids: `items-settings-link`, `settings-logo-image`, `settings-theme-switch`, `settings-language-en-button`, `settings-language-pt-button`.

## Tests

- `src/pages/settings/ui/SettingsPage.test.tsx`: switching to Portuguese, and the theme switch storing the dark theme.
- `src/shared/config/theme/theme.test.ts` and `src/shared/config/i18n/i18n.test.ts`: what is chosen at start-up from what was stored.
- `src/app/routes.test.tsx`: opening the settings page from the header.
- `.maestro/flows/settings-language.yml`: opening settings and switching to Portuguese on an emulator.

## Decisions

- Libraries: [ADR 0006](../adr/0006-theming-storage-and-translations.md).

## Limits

There is no "follow the system theme" option, and only English and Portuguese exist.
