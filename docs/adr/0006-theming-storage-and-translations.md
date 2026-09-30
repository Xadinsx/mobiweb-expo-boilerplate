# 0006. Unistyles, MMKV and i18next for theming, storage and translations

- Status: accepted
- Date: 2026-09-30

## Context

The boilerplate will seed a white-label app, so brand colors, dark mode and languages must come from one place, and user choices must survive a restart. GitHubExplorer, the reference project, uses Unistyles, MMKV and i18next and worked well.

## Decision

- **Theming:** `react-native-unistyles` v3. Styles are written with `StyleSheet.create((theme) => ...)` in a `*.styles.ts` file next to each component. The tokens and the light and dark themes live in `src/shared/config/theme`, and the chosen theme is stored.
- **Storage:** `react-native-mmkv`, behind a small `storage` wrapper in `src/shared/lib` with named keys.
- **Translations:** `i18next` with `react-i18next`, and `expo-localization` for the device language. English and Portuguese, with keys type-checked against the English resources.
- The theme and translations are configured in `index.ts`, before the router starts, because Unistyles needs its configuration before any component creates styles.

## Alternatives

- Plain `StyleSheet` with a theme context: no native module, but every component re-renders on a theme change and there are no built-in variants or breakpoints.
- NativeWind (Tailwind classes): fast to write, but styles then live in class strings instead of typed objects.
- AsyncStorage: works in Expo Go and is simpler, but slower and asynchronous, which forces a loading state for the theme at start-up.

## Consequences

- Unistyles and MMKV contain native code and need the New Architecture, so Expo Go does not work. Developers build a development app with `expo run:android` or `expo run:ios`, and CI builds the release APK anyway.
- Tests use the Unistyles mock in `jest.setup.ts`; MMKV is mocked automatically by its own Jest support.
- The Babel plugin in `babel.config.js` rewrites styles in `src/`, so code outside `src/` must not use Unistyles styles.
- Server state (TanStack Query) is added in a separate change with its own decision.
