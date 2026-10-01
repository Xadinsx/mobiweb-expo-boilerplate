# 0007. Vendor config and recommended defaults

- Status: accepted
- Date: 2026-09-30

## Context

The boilerplate seeds a white-label app: one codebase, a separate app per vendor, built at build time. Vendors can differ in look, identity, languages, features and backend. The first version of the theming work (ADR 0006) fixed one look and two languages in shared code, which suited one app but made every other vendor a fork. Clients may also want a different library from our defaults, such as plain styles instead of Unistyles.

## Decision

- **Vendor config.** Each vendor is a folder `vendors/<name>/` with `vendor.json` (identity, palettes, supported schemes and languages and whether users choose, features, backend, public service ids), `runtime.ts` and `assets/`. `APP_VARIANT` picks the vendor; only that folder is bundled. Shared code provides mechanisms; each vendor's config holds the choices. See `docs/vendors.md`.
- **Recommended defaults, not locks.** Each capability is a module with a manifest in `docs/modules/`. The company recommends its default. A client may decline one, which is recorded as a deviation ADR (`NNNN-deviation-<capability>.md`); the manifest, its rules and its checks are then updated to match what is installed.
- **One primary vendor.** `vendors/default` is the project's vendor for its whole life. CI builds one reference vendor and checks isolation of all vendors.

## Alternatives

- **A fork per vendor:** simple at first, but fixes and upgrades must be copied into every fork.
- **Runtime configuration from a server:** cannot change the native name, ids and icons, and adds a network dependency at start-up.
- **Hard-locked stack:** easy to maintain, but the company would have to refuse or fork for any client that wants another library.
- **Vendor data in TypeScript:** nicer to type, but Expo evaluates `app.config.ts` with Node and cannot load other TypeScript files, so the data is JSON.

## Consequences

- Adding a vendor is adding a folder, with no shared code changes unless it needs a new mechanism.
- Every module's rules live in its manifest, so a declined module leaves no stale rule.
- Deviations cost a record and some upkeep of the manifests, but they are visible and reviewable.
- The vendor config may hold only public identifiers, because anything inside an app can be read.
