import { ApiError } from "./api-error";

/** A JSON client for one backend. `fetchFn` is passed in so tests need no network. */
export function createHttpClient(baseUrl: string, fetchFn: typeof fetch) {
  const root = baseUrl.replace(/\/+$/, "");

  return {
    async get(path: string): Promise<unknown> {
      let response: Response;
      try {
        response = await fetchFn(`${root}/${path.replace(/^\/+/, "")}`);
      } catch {
        throw new ApiError("network", "The request did not reach the server");
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
      } catch {
        throw new ApiError("invalid-response", "The response was not JSON");
      }
    },
  };
}
