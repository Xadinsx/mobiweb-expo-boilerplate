import { ApiError } from "./api-error";

const defaultTimeoutMs = 15_000;

type Options = {
  /** How long a request may take before it is reported as a network error. */
  timeoutMs?: number;
};

/** A JSON client for one backend. `fetchFn` is passed in so tests need no network. */
export function createHttpClient(
  baseUrl: string,
  fetchFn: typeof fetch,
  { timeoutMs = defaultTimeoutMs }: Options = {},
) {
  const root = baseUrl.replace(/\/+$/, "");

  return {
    /** `signal` lets the caller cancel; a cancelled request rethrows the abort, not an ApiError. */
    async get(path: string, signal?: AbortSignal): Promise<unknown> {
      const request = new AbortController();
      const abort = () => request.abort();
      signal?.addEventListener("abort", abort);
      if (signal?.aborted) {
        abort();
      }
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        abort();
      }, timeoutMs);

      // A timeout is reported as a network error. A caller's cancel rethrows the abort as it is.
      const failure = (error: unknown, fallback: ApiError) => {
        if (timedOut) {
          return new ApiError("network", "The request timed out");
        }
        return signal?.aborted ? error : fallback;
      };

      try {
        let response: Response;
        try {
          response = await fetchFn(`${root}/${path.replace(/^\/+/, "")}`, {
            signal: request.signal,
          });
        } catch (error) {
          throw failure(
            error,
            new ApiError("network", "The request did not reach the server"),
          );
        }

        if (!response.ok) {
          throw new ApiError(
            "http",
            `The server answered ${response.status}`,
            response.status,
          );
        }

        try {
          return await response.json();
        } catch (error) {
          throw failure(
            error,
            new ApiError("invalid-response", "The response was not JSON"),
          );
        }
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", abort);
      }
    },
  };
}
