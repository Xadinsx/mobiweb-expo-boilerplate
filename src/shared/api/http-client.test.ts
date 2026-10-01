import { ApiError } from "./api-error";
import { createHttpClient } from "./http-client";

function answer(status: number, body: () => Promise<unknown>) {
  return jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: body,
  });
}

describe("createHttpClient", () => {
  it("returns the parsed body of a successful response", async () => {
    const fetchFn = answer(200, () => Promise.resolve([{ id: "1" }]));
    const client = createHttpClient("https://api.example.com", fetchFn);

    await expect(client.get("/items")).resolves.toEqual([{ id: "1" }]);
    expect(fetchFn).toHaveBeenCalledWith("https://api.example.com/items");
  });

  it("joins the base url and the path with one slash", async () => {
    const fetchFn = answer(200, () => Promise.resolve({}));
    const client = createHttpClient("https://api.example.com/", fetchFn);

    await client.get("items/2");

    expect(fetchFn).toHaveBeenCalledWith("https://api.example.com/items/2");
  });

  it("reports a dropped connection as a network error", async () => {
    const fetchFn = jest.fn().mockRejectedValue(new TypeError("offline"));
    const client = createHttpClient("https://api.example.com", fetchFn);

    const failure = await client.get("/items").catch((error) => error);

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
