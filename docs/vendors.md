# Vendors

A vendor is one branded app built from this codebase: its own name, store ids, icon, colors, languages, features and backend. A build is for exactly one vendor, chosen when you build.

## Where a vendor lives

```text
vendors/<name>/vendor.json   plain data: identity, look, schemes, languages, features, backend
vendors/<name>/runtime.ts    runtime assets the app shows (the logo), as literal requires
vendors/<name>/assets/       icon, adaptive icon and other images
```

`vendors/default` is the project's primary vendor. The type of `vendor.json` is `VendorConfig` in `src/shared/config/vendor/vendor-config.ts`, and `app.config.ts` checks every vendor on load, so a missing or mistyped field fails with a message that names it.

`vendor.json` is plain data because Expo evaluates `app.config.ts` with Node, which cannot load other TypeScript files. Runtime images cannot be JSON, so they sit in `runtime.ts`.

## Choosing a vendor

Set `APP_VARIANT` to the vendor's folder name. It defaults to `default`.

```bash
APP_VARIANT=default npx expo run:android
APP_VARIANT=default npx expo start
```

Unknown names fail with a list of the vendors that exist. Local runs, CI and EAS builds all use the same variable; `eas.json` profiles set it under `env`.

## How only one vendor ships

- `app.config.ts` reads the chosen vendor for the app name, ids, icons and scheme.
- In the app, `@vendor/...` imports resolve to `vendors/<APP_VARIANT>/...` (a rule in `metro.config.js`, mirrored in `jest.config.js`), so Metro bundles only that folder. `tsconfig.json` points `@vendor` at the `default` vendor for types.
- Restart the dev server after changing `APP_VARIANT`, because Metro does not re-read the environment.

## What goes in a vendor

- **Identity:** name, URL scheme, iOS bundle id, Android package, icon and adaptive icon. Each vendor needs its own name, scheme and ids; a test enforces it.
- **Look:** a palette for each color scheme the vendor supports (`light`, `dark` or both).
- **Schemes and languages:** what is supported, the default, and whether users can choose. A language code must exist in the registry `src/shared/config/i18n/languages.ts`; adding a language is one translation file plus one line there, and the app refuses to start for a code with no translation.
- **Features and backend:** named flags and the API base URL.
- **Services:** public identifiers only, such as a crash-reporting DSN. Anything inside an app can be read, so never put a secret in a vendor.
- **`eas`** (optional): owner, project id and slug, for a vendor with its own EAS project. Other vendors use the boilerplate's.

## Tests and checks per vendor

- `npm test` finds every folder in `vendors/`, validates it, and checks that names, schemes and ids are unique.
- `npm run vendor-isolation` (in the `checks` job) exports each vendor's Android bundle and fails if it contains another vendor's name, scheme, ids, API URL or asset files. Values one vendor shares with or contains from another also fail, because a search for them could not tell the vendors apart.
- Device checks build one vendor, the reference vendor (repository variable `REFERENCE_VENDOR`, `default` when unset). To try another vendor on a device, change the variable or run it locally with `APP_VARIANT`.
- Shared Maestro flows in `.maestro/flows` use `appId: ${APP_ID}`. A flow that only fits some vendors goes in `vendors/<name>/maestro/`.
- `vendors/<name>/qa-notes.md` tells the QA agent what the vendor's app looks like and what it can do.
- `sample-single` exists to prove the model: one language, light only, no user choices, its own brand and ids. Delete it when you start a real project only if you no longer want that proof.

## Not supported yet

Custom fonts and splash screens are not part of a vendor yet, because the project has no font or splash module. They are added with those modules.
