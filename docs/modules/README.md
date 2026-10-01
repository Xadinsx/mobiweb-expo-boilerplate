# Modules

A module is a capability the boilerplate ships with a recommended default, such as styling or storage. Each module has a manifest here that says what it adds, where the app depends on it, what changes when it is swapped or removed, and which rules and checks it brings.

The company recommends these defaults. A client may decline one, and that is recorded as a deviation (see below). Nothing here is locked.

Read this index first, then only the manifests you need. People work from the manifests, and so will the `module` skill once it exists (planned).

## Core, never optional

Typecheck, lint, tests, dead-code detection (`knip`), the CI workflow, the secret scan, the commit-message check, the docs system, the vendor model (`vendors/`, its tests and `pnpm vendor-isolation`), and the Claude workflow docs. Core libraries are Expo, Expo Router and what they need (`expo-constants`, `expo-linking`, `react-native-safe-area-context`, `react-native-screens`). These are not modules.

## Modules

| Module | Recommended default | Status in this project |
|---|---|---|
| [Styling](styling.md) | Unistyles | in use |
| [Storage](storage.md) | MMKV | in use |
| [Translations](translations.md) | i18next with react-i18next | in use |
| [Architecture check](architecture.md) | Feature-Sliced Design checked by Steiger | in use |
| [Device checks](device-checks.md) | Maestro on GitHub Actions | in use |
| [QA agent](qa-agent.md) | Claude Code driving agent-device | in use |
| [Package manager](package-manager.md) | pnpm (isolated installs) | in use |

Server state, crash reporting and release automation get their manifests when those modules are built.

## Status values

- **in use**: the recommended default is installed.
- **deviation**: a different choice is installed, or the module is removed. The status links the deviation ADR, for example `deviation: [0008](../adr/0008-deviation-styling.md)`.

## How to write a manifest

Copy the shape of an existing one: front matter, then these sections in this order.

1. **Adds**: dependencies, config, scripts, CI steps and folders the module brings.
2. **Where the app depends on it**: searches that find every use. Give import specifiers, config keys, script names and CI step names. A file list is only an example; if a search finds something the manifest does not mention, fix the manifest.
3. **On swap or removal**: what must change, in order.
4. **Rules**: the coding rules that only make sense with this module. They live here, not in `docs/ai/house-style.md`, so a removed module leaves no stale rule.
5. **Checks**: what the module adds to the gates.
6. **Leftover checks**: searches that must return nothing after a removal or swap, and files that must exist after an add.

## Deviations

To decline a recommended default, write a deviation ADR named `NNNN-deviation-<capability>.md` from `docs/adr/template.md` (deviation variant), change the module's status here, and update the manifest's rules and checks to match what is now installed. The deviation states the recommended default, the choice made, the reason, the steps taken, and the rules and checks that now differ.
