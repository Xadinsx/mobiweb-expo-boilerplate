# House style

The goal is a codebase that reads as if one careful person wrote it: simple, readable, no messy or abstract helpers. Speed matters less than that.

## Write the simplest thing that works

- Pick the most direct solution. If a plain function, a plain component, or a few repeated lines do the job, use them.
- Match the surrounding code: naming, file layout, and idiom. Do not introduce a new pattern next to an existing one.
- Add nothing the task did not ask for: no options, modes, retries, or handling for cases that cannot happen here.

## Search before you write

Before creating a component, hook, or helper, search the repo for one that already does the job (`grep` for the name and for the behavior). Reuse or extend it. Say in the PR what you found.

## When to abstract, and when to leave repetition

Wrong repetition and a wrong abstraction are both defects. Decide each case on its merits.

- Do not abstract from a single use, or from a guess about future uses.
- Consider a shared helper only when there are repeated real uses that change for the same reason.
- Leave a small repetition when merging the copies would need flags, generic types, or indirection that makes each call site harder to read.
- When unsure, leave the repetition and note it in the PR.

Every PR that adds or removes an abstraction, or merges or leaves duplicated code, fills in "Decisions weighed" in the PR description:

- how many real uses there are
- whether the result reads clearer or murkier
- what it costs if the uses later diverge

A human reviewer signs off on that judgment. Tools such as `knip` only find candidates; they do not decide.

## Architecture: Feature-Sliced Design

The layout follows Feature-Sliced Design (FSD); `docs/adr/0001-feature-sliced-design.md` says why. `npm run fsd` (Steiger) is the judge, and CI runs it.

- **Layers**, from top to bottom: `app`, `pages`, `widgets`, `features`, `entities`, `shared`. Code may import only from layers below its own. Slices on the same layer never import each other.
- **Add layers only when needed.** The repo has the layers it uses. Create `widgets`, `features` or `shared` when the first real second use appears, not before.
- **Where does it go?**
  - A whole screen goes in `pages/<name>`.
  - A user action that several pages reuse goes in `features/<name>`.
  - A business object (its type, data access, and its row or card UI) goes in `entities/<name>`.
  - Generic code with no business meaning (UI kit, helpers, config) goes in `shared`.
  - Providers and app start-up go in `app`.
- **Segments** group code inside a slice by purpose: `ui`, `model`, `api`, `lib`, `config`. The `app` layer has no `ui` segment; its segments are named for what they hold, such as `navigation`.
- **Public API.** Every slice exports what others may use from its `index.ts`. Import another slice as `@/entities/item`, never from a file inside it.
- **Routes** in the root `app/` folder are one-line re-exports of a page. They hold no logic.
- **Tests** sit next to the file they test (`ItemsList.test.tsx`). Route-level tests live in `src/app/routes.test.tsx`.

## Styling, text and storage

- **Styles** live next to the component in `Component.styles.ts`, created with `StyleSheet.create((theme) => ({ ... }))` from `react-native-unistyles`. No inline styles and no color or size literals in components: take them from the theme.
- **Theme** tokens (spacing, radius, font sizes) and the light and dark themes are in `src/shared/config/theme`. Add a token when a second component needs the same value.
- **Text** shown to users goes through `useTranslation()` and a key in `src/shared/config/i18n/resources.ts`, in every language the boilerplate ships (see the registry in `src/shared/config/i18n/languages.ts`). Keys are type-checked, so a missing translation fails `npm run typecheck`. Data from a backend or fixtures is not translated.
- **Storage** goes through `storage` from `@/shared/lib`, with a named key. Do not call MMKV directly.
- **Shared segments** (`config`, `lib`, `ui`, `api`) expose a public API in their `index.ts`. Import `@/shared/config`, not a file inside it.

## Test IDs and accessibility

Every interactive element, and every text or list a test needs to read, has a `testID`. Interactive elements also have an accessibility label. Maestro and the QA agent depend on these.

Name a `testID` as `<screen>-<element>-<role>`, in kebab-case. The role is one of `button`, `text`, `list`, `input`, `image`, `link`, or `switch`. Repeated elements add their id after the element name.

Examples: `items-main-list`, `items-row-2-button`, `detail-title-text`.

## Checks

Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run fsd`, and `npm run dead-code` before opening a PR. Formatting comes from Prettier through ESLint; run `npx eslint . --fix` to apply it.
