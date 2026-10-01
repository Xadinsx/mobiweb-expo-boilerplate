import { createHttpItemSource } from "./http-item-source";
import { ApiError } from "@/shared/api";

function clientAnswering(answer: () => Promise<unknown>) {
  return { get: jest.fn(answer) };
}

describe("the HTTP item source", () => {
  it("asks the backend for the list and the item", async () => {
    const client = clientAnswering(() => Promise.resolve([]));
    const source = createHttpItemSource(client);

    await source.list();
    await source.get("2");

    expect(client.get).toHaveBeenNthCalledWith(1, "/items");
    expect(client.get).toHaveBeenNthCalledWith(2, "/items/2");
  });

  it("encodes the id so it cannot reach another path on the backend", async () => {
    const client = clientAnswering(() => Promise.resolve({}));
    const source = createHttpItemSource(client);

    await source.get("../admin?x=1");

    expect(client.get).toHaveBeenCalledWith("/items/..%2Fadmin%3Fx%3D1");
  });

  it("turns a 404 on one item into null", async () => {
    const source = createHttpItemSource(
      clientAnswering(() =>
        Promise.reject(new ApiError("http", "Not found", 404)),
      ),
    );

    await expect(source.get("999")).resolves.toBeNull();
  });

  it("lets every other failure reach the caller", async () => {
    const source = createHttpItemSource(
      clientAnswering(() =>
        Promise.reject(new ApiError("http", "Server error", 500)),
      ),
    );

    await expect(source.get("2")).rejects.toMatchObject({
      kind: "http",
      status: 500,
    });
  });
});
