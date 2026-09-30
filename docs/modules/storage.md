---
capability: local key-value storage
recommended: MMKV v4
why: It is synchronous, so the stored theme and language are known before the first screen, which avoids a flash of the wrong theme. The cost is a native module and a development build.
decision: ../adr/0006-theming-storage-and-translations.md
---

# Storage

## Adds

- Dependency `react-native-mmkv` (needs `react-native-nitro-modules`, which styling also needs: remove it only when both modules are gone).
- `src/shared/lib/storage`: the `storage` wrapper with named keys.

## Where the app depends on it

- `react-native-mmkv` in `src/shared/lib/storage` and in tests that build an instance.
- `storage` imported from `@/shared/lib`, which today means: the theme (`src/shared/config/theme/theme.ts`), the language (`src/shared/config/i18n/i18n.ts`), and `src/shared/config/vendor-choices.test.ts`.
- The named keys `theme` and `language`.

## On swap or removal

Another store (AsyncStorage, for example) is asynchronous, so the start-up rules change.

1. Keep the wrapper's public API if the new store can be read synchronously. If it cannot, read stored values during app start before the first screen, and keep the initial-scheme and initial-language rules, which take the stored value as an argument.
2. Replace the implementation inside `src/shared/lib/storage` and its tests.
3. Remove the dependency.

Removing storage means the theme and language are never remembered: the settings page must then not offer them, which a vendor can already set with `userChoice: false`.

## Rules

- Storage goes through `storage` from `@/shared/lib`, with a named key. Do not call the storage library directly.

## Checks

- `src/shared/config/vendor-choices.test.ts` proves choices are stored only when the vendor allows them.

## Leftover checks

After a swap away from MMKV, `grep -rn "react-native-mmkv" src app jest.setup.ts package.json` must find nothing.
