# 0009. Server state with TanStack Query and a typed API layer

- Status: accepted
- Date: 2026-10-01

## Context

The sample's items were a hard-coded array that both pages imported, and each vendor's `backend.apiBaseUrl` was read nowhere. A project with a backend would have written its own client, failure handling and loading screens, differently each time. The device checks and the QA agent run on an emulator with no backend, so the boilerplate has to work without one.

## Decision

- **The recommended module for server data is TanStack Query v5** (`docs/modules/server-state.md`). A client that wants another library records a deviation.
- **A typed API layer sits under it.** Each resource has an API in its entity. A backend response is mapped to the app's type, and every failure is one `ApiError` that says whether it was the network, an HTTP status, or a response of the wrong shape.
- **The sample runs on an in-memory mock** behind the same interface as a tested HTTP source that reads the vendor's `backend.apiBaseUrl`. Which one answers is one line in the entity's API file. There is no runtime or per-vendor switch.
- **Every screen that loads data shows a loading view, an error view with Retry, and its empty state.** The views are shared and take a test id prefix.

## Alternatives

- **No library, `fetch` in effects:** nothing to add, but each screen would reimplement caching, retries and the pending and error states.
- **SWR or RTK Query:** both would work behind the same hooks. TanStack Query was chosen for its explicit pending, error and refetch states and its React Native guidance.
- **A real HTTP call with a fake server in tests:** closer to production, but the emulator checks would need a reachable server.
- **A per-vendor switch between mock and HTTP:** more flexible, and one more setting and code path for every vendor.

## Consequences

- A project's first endpoint is a source method, a mapper entry and a hook. Failures already reach the screens in a uniform way.
- Tests that render a screen supply their own client. The mock never fails, so the error and Retry screens are covered by unit tests only, not by Maestro or the QA agent.
- Left for the first project with a real backend, because the mock never exercises them: a request timeout on the HTTP client, passing the abort signal through the hooks, app-focus and online-status handling, and persisting the cache for offline start.
