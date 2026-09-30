# Settings

Status: in use (sample feature)

## What it does

A settings page where the user switches between the light and dark theme and between English and Portuguese. Both choices are remembered the next time the app starts.

## Behavior

What the page offers comes from the vendor's config (`docs/vendors.md`), not from the code.

- The page shows the vendor's logo at the top.
- A dark theme switch appears only when the vendor supports both color schemes and lets users choose. It applies the scheme at once.
- Language buttons appear only when the vendor ships more than one language and lets users choose, each named in its own language. Choosing one switches all app text at once, and the selected one is marked.
- A vendor that offers no choice sees the message "Nothing to change."
- At start-up the scheme is the stored choice if users may choose and it is supported, otherwise the vendor's default. The language is the stored choice if allowed and supported, then the device language if supported, then the vendor's default.
- Choices are stored on the device (MMKV) under the keys `theme` and `language`, and only when the vendor allows the choice.

## Screens and routes

| Route | Page | What the user sees |
|---|---|---|
| `/settings` | `pages/settings` | The theme switch and the two language buttons |

The page opens from the "Settings" link in the header of the items list.

## Code

- `src/pages/settings` holds the page and its styles; the logo comes from the vendor (`vendors/<name>/runtime.ts`).
- `src/shared/config/theme` holds the tokens, the function that builds a theme from a vendor's palette, the initial scheme rule and `setTheme`.
- `src/shared/config/i18n` holds the translations, the language registry, the initial language rule and `setLanguage`.
- `src/shared/lib/storage` wraps MMKV.
- Test ids: `items-settings-link`, `settings-logo-image`, `settings-theme-switch`, `settings-language-en-button`, `settings-language-pt-button`.

## Tests

- `src/pages/settings/ui/SettingsPage.test.tsx`: switching to Portuguese, the theme switch, and the page for vendors that offer both, one, or no choices.
- `src/shared/config/theme/create-themes.test.ts` and `src/shared/config/i18n/resolve-language.test.ts`: what is chosen at start-up from what was stored and what the vendor offers.
- `src/shared/config/vendor-choices.test.ts`: choices are ignored when the vendor does not allow them.
- `src/app/routes.test.tsx`: opening the settings page from the header.
- `.maestro/flows/settings-language.yml`: opening settings and switching to Portuguese on an emulator.

## Decisions

- Libraries: [ADR 0006](../adr/0006-theming-storage-and-translations.md).

## Limits

There is no "follow the system theme" option, and only English and Portuguese are shipped. Adding a language is a translation file plus a line in the language registry.
