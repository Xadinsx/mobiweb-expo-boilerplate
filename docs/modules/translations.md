---
capability: translated text
recommended: i18next with react-i18next and expo-localization
why: It is the common choice, it supports typed keys, and the device language can pick the first language. Cost: every user-visible string goes through a key.
decision: ../adr/0006-theming-storage-and-translations.md
---

# Translations

## Adds

- Dependencies `i18next`, `react-i18next` and `expo-localization`, and the `expo-localization` plugin in `app.config.ts`.
- `src/shared/config/i18n`: the translations, the language registry (`languages.ts`), the initial-language rule, `setLanguage`, and the key typing.
- The language buttons on the settings page.
- `languages` in each vendor's `vendor.json`.

## Where the app depends on it

- `useTranslation` or `react-i18next` in components and pages.
- `i18next` and `expo-localization` in `src/shared/config/i18n` and `app.config.ts`.
- `resources.ts` keys such as `settings.nothingToChange`.
- `setLanguage`, `languageOptions` and `settings-language-` test ids (settings page, Maestro flows, QA notes).
- `languages` in `vendors/*/vendor.json`, `vendor-config.ts` and the vendors validation in `app.config.ts`.

## On swap or removal

1. Another i18n library: keep the registry and the initial-language rule, replace the setup in `i18n.ts`, the `useTranslation` call sites and the key typing.
2. Removing translations: replace each `t("key")` with its English text, delete `src/shared/config/i18n`, the `languages` field in the vendor type and vendor files and in their validation, the language buttons and the Maestro language flow, then the dependencies and the plugin.

## Rules

- Text shown to users goes through `useTranslation()` and a key in `src/shared/config/i18n/resources.ts`, in every language the boilerplate ships (the registry is `src/shared/config/i18n/languages.ts`). Keys are type-checked, so a missing translation fails `npm run typecheck`. Data from a backend or fixtures is not translated.
- Adding a language is a translation file plus one line in the registry. A vendor lists a language only if the registry has it; the app refuses to start otherwise.

## Checks

- `npm run typecheck` fails on a missing key or translation.
- `src/shared/config/i18n/languages.test.ts` and `resolve-language.test.ts`.

## Leftover checks

After removal, `grep -rn "react-i18next\|i18next\|expo-localization\|useTranslation" src app index.ts jest.setup.ts app.config.ts package.json` must find nothing.
