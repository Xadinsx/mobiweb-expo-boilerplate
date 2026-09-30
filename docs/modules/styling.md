---
capability: styling and theming
recommended: Unistyles v3
why: Themes are real objects read by every style, so a vendor's palettes drive the whole app without inline values. It is fast because styles are processed at build time. The cost is a native module, so Expo Go no longer works.
decision: ../adr/0006-theming-storage-and-translations.md
---

# Styling

## Adds

- Dependency `react-native-unistyles` (needs `react-native-nitro-modules` and the New Architecture).
- The Babel plugin `react-native-unistyles/plugin` in `babel.config.js`, with `root: "src"`.
- `src/shared/config/theme`: the tokens, `createThemes` (builds a theme from a vendor's palette), the initial-scheme rule, `setTheme`, and the typing of the themes (the `AppThemes` declaration in `theme.ts`).
- A `*.styles.ts` file next to each component.
- The mock import `react-native-unistyles/mocks` in `jest.setup.ts`.
- The dark theme switch on the settings page.

## Where the app depends on it

Search for each; a swap or removal must handle every hit.

- `react-native-unistyles` in any file (styles, `theme.ts`, tests, `jest.setup.ts`, `package.json`).
- `StyleSheet.create((theme` in `*.styles.ts`.
- `useUnistyles` or `UnistylesRuntime` in components.
- `./src/shared/config` imported in `index.ts` (configures the theme before any style is created).
- `setTheme` and `settings-theme-switch` (settings page, its test, QA notes).
- `look.palettes` and `schemes` in `vendors/*/vendor.json`, and the vendor type in `src/shared/config/vendor/vendor-config.ts`.

## On swap or removal

Replacing Unistyles with plain `StyleSheet` keeps the vendor palettes; only what reads them changes.

1. Keep `createThemes`, but expose the current theme through a small React context instead of Unistyles.
2. Rewrite each `*.styles.ts` to a plain `StyleSheet.create` that takes the theme from that context, or turn it into a hook returning styles.
3. Rewrite `setTheme` and the settings theme switch to set the context, still storing the choice through the storage module.
4. Remove the Babel plugin, the `jest.setup.ts` mock, the dependency and the `AppThemes` typing; add a test wrapper that provides the context.
5. Dev builds are no longer needed for styling; keep them if another native module needs them.

Removing styling entirely is not supported: the vendor's look would have nowhere to go.

## Rules

- Styles live next to the component in `Component.styles.ts`, created with `StyleSheet.create((theme) => ({ ... }))` from `react-native-unistyles`. No inline styles, and no color or size literals in components: take them from the theme.
- Tokens (spacing, radius, font sizes) are in `src/shared/config/theme`, and each vendor's palettes are in its `vendor.json`. Add a token when a second component needs the same value.

## Checks

- Jest runs with the Unistyles mock in `jest.setup.ts`.
- `npm run typecheck` checks the theme typing.

## Leftover checks

After a swap away from Unistyles, these must find nothing:

- `grep -rn "react-native-unistyles" src app index.ts jest.setup.ts babel.config.js package.json`
- `grep -rn "unistyles" docs/ai CLAUDE.md README.md` (mentions that are not in a deviation ADR)

After adding, these must exist: the Babel plugin entry, the mock import, and a `*.styles.ts` for each component that has styles.
