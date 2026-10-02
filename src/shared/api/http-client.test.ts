import { ApiError } from "./api-error";
import { createHttpClient } from "./http-client";

function answer(status: number, body: () => Promise<unknown>) {
  return jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: body,
  });
}

async function failureOf(request: Promise<unknown>) {
  try {
    await request;
  } catch (error) {
    return error;
  }
  return undefined;
}

describe("createHttpClient", () => {
  it("returns the parsed body of a successful response", async () => {
    const fetchFn = answer(200, () => Promise.resolve([{ id: "1" }]));
    const client = createHttpClient("https://api.example.com", fetchFn);

    await expect(client.get("/items")).resolves.toEqual([{ id: "1" }]);
    expect(fetchFn).toHaveBeenCalledWith("https://api.example.com/items", {
      signal: expect.any(AbortSignal),
    });
  });

  it("joins the base url and the path with one slash", async () => {
    const fetchFn = answer(200, () => Promise.resolve({}));
    const client = createHttpClient("https://api.example.com/", fetchFn);

    await client.get("items/2");

    expect(fetchFn).toHaveBeenCalledWith("https://api.example.com/items/2", {
      signal: expect.any(AbortSignal),
    });
  });

  it("reports a dropped connection as a network error", async () => {
    const fetchFn = jest.fn().mockRejectedValue(new TypeError("offline"));
    const client = createHttpClient("https://api.example.com", fetchFn);

    const failure = await failureOf(client.get("/items"));

    expect(failure).toBeInstanceOf(ApiError);
    expect(failure).toMatchObject({ kind: "network" });
  });

  it("reports an error status as an http error with the status", async () => {
    const client = createHttpClient(
      "https://api.example.com",
      answer(500, () => Promise.resolve({})),
    );

    await expect(client.get("/items")).rejects.toMatchObject({
      kind: "http",
      status: 500,
    });
  });

  it("reports a body that is not JSON as an invalid response", async () => {
    const client = createHttpClient(
      "https://api.example.com",
      answer(200, () => Promise.reject(new SyntaxError("Unexpected token"))),
    );

    await expect(client.get("/items")).rejects.toMatchObject({
      kind: "invalid-response",
    });
  });
});

describe("createHttpClient timeout and cancel", () => {
  // A fetch that never answers and rejects the way fetch does when its signal aborts.
  function silentFetch() {
    return jest.fn(
      (_url: string, init: { signal: AbortSignal }) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal.addEventListener("abort", () =>
            reject(Object.assign(new Error("aborted"), { name: "AbortError" })),
          );
        }),
    ) as unknown as typeof fetch;
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("reports a request that takes too long as a network error", async () => {
    const client = createHttpClient("https://api.example.com", silentFetch(), {
      timeoutMs: 50,
    });

    const failure = failureOf(client.get("/items"));
    jest.advanceTimersByTime(50);

    expect(await failure).toMatchObject({
      kind: "network",
      message: expect.stringContaining("timed out"),
    });
  });

  it("gives up after 15 seconds when no timeout is given", async () => {
    const client = createHttpClient("https://api.example.com", silentFetch());

    const failure = failureOf(client.get("/items"));
    jest.advanceTimersByTime(14_999);
    await Promise.resolve();
    jest.advanceTimersByTime(1);

    expect(await failure).toMatchObject({ kind: "network" });
  });

  it("lets the caller cancel, and does not call that a failure of the backend", async () => {
    const client = createHttpClient("https://api.example.com", silentFetch());
    const caller = new AbortController();

    const failure = failureOf(client.get("/items", caller.signal));
    caller.abort();
    const error = await failure;

    expect(error).not.toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ name: "AbortError" });
  });

  it("stops the timer once the response has arrived", async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    });
    const client = createHttpClient("https://api.example.com", fetchFn, {
      timeoutMs: 50,
    });

    await client.get("/items");

    expect(jest.getTimerCount()).toBe(0);
  });
});
