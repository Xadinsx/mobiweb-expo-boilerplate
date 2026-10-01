---
name: add-vendor
description: Add a new vendor (a white-label app variant) to this project from a few answers. Use when asked to add, create or onboard a vendor or client app.
disable-model-invocation: true
---

# Add a vendor

Adds `vendors/<name>/` with its config, assets and QA notes, plus an `eas.json` profile, and stops only when the checks pass. Read `docs/vendors.md` first: it says what a vendor is. Do not edit any other vendor.

Read the status column of `docs/modules/README.md` too. A step that belongs to a module this project has removed is skipped: no `qa-notes.md` when the QA agent is removed, no vendor Maestro flow when device checks are removed, and leave out the device-check sentence in the report.

## 1. Ask

Ask these, one group at a time, and suggest a default where you can:

1. **Name** (folder name, lowercase, letters, digits and dashes) and display name.
2. **Identity:** URL scheme, iOS bundle id, Android package. The Android package normally equals the iOS bundle id.
3. **Look:** a palette for each color scheme: `background`, `text`, `mutedText`, `border`, `accent`. A logo and icon files if they have them; otherwise you write placeholders.
4. **Schemes:** which of light and dark it supports, the default, and whether users can choose.
5. **Languages:** which, the default, and whether users can choose.
6. **Features** (named flags) and **backend** (API base URL).
7. **Services:** only public identifiers, such as a crash-reporting DSN. Tell the user that anything inside an app can be read, so never give a secret, and do not write one into the vendor.

Fonts and splash screens are not supported yet; say so if asked.

## 2. Refuse early

Before writing anything, refuse and say what to do instead when:

- `vendors/<name>` already exists.
- The name, URL scheme, bundle id, package or API URL equals or contains one of another vendor's values, or the reverse. (`npm run vendor-isolation` enforces this; check the values yourself first.)
- A language is not in the registry `src/shared/config/i18n/languages.ts`. Offer to add it (step 4) or to drop it.
- A scheme's palette is missing, or a value is a secret.

If `npm run vendor-isolation` later flags a value of the new vendor that also appears in library text (a very short scheme, for example), choose a more distinctive value.

## 3. Write the vendor

Copy the shape of an existing vendor, for example `vendors/default/`:

- `vendors/<name>/vendor.json` from the answers.
- `vendors/<name>/runtime.ts`, the same as the other vendors' (it requires `./assets/icon.png` as the logo).
- `vendors/<name>/assets/`: the files they gave, named `icon.png`, `android-icon-foreground.png`, `android-icon-background.png`, `android-icon-monochrome.png`. If they gave none, run `python3 .claude/skills/add-vendor/placeholder-assets.py vendors/<name>/assets <background-hex> <accent-hex>`. Never copy another vendor's assets: the isolation check compares files.
- `vendors/<name>/qa-notes.md`: write it like `vendors/default/qa-notes.md`. Start with "- App id: `${APP_ID}`." and describe what the app shows for this vendor (for example, which settings controls exist).
- A vendor-only Maestro flow in `vendors/<name>/maestro/` only when the vendor's screens differ from the shared flows.
- An `eas.json` profile named after the vendor: copy `e2e-test` and set `env.APP_VARIANT` to the vendor name.

## 4. A language that is not in the registry

Only if the user asks for it: add the translations as a new object in `src/shared/config/i18n/resources.ts`, typed `typeof en` like `pt`, with every key translated, and one line in `src/shared/config/i18n/languages.ts` with its native name. Update nothing else. Ask the user to have a person check the translations.

## 5. Check until green

Run, and fix what they report, until all pass:

```bash
npx eslint . --fix
npm run typecheck
npm test
npm run fsd
npm run dead-code
npm run vendor-isolation
```

`npm test` validates every vendor, and `npm run vendor-isolation` exports every vendor's bundle. Also run `APP_VARIANT=<name> npx expo config --type public` and confirm the name and ids are the new vendor's. If you cannot get green, stop and list what is left; do not report success.

`package.json` may be rewritten by Expo tooling (the `android` and `ios` scripts must stay `expo run:android` and `expo run:ios`). Check `git diff package.json` is empty.

## 6. Report

Show `git status`. The only changes should be under `vendors/<name>/`, the `eas.json` profile, and for a new language the two i18n files. Say anything else you changed and why. Tell the user to commit on a branch named for the vendor, open a PR, and note the session's token use from the app's usage view (you cannot read it). The device checks build one reference vendor; to see this one on a device, set the repository variable `REFERENCE_VENDOR` for a run or build it locally with `APP_VARIANT`.
