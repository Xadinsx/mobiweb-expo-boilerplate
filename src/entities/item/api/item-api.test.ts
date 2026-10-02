import { createHttpItemSource } from "./http-item-source";
import { createItemApi, itemApi } from "./item-api";
import { createHttpClient } from "@/shared/api";

describe("the item API on the mock source", () => {
  it("lists the three sample items the screens show", async () => {
    const items = await itemApi.list();

    expect(items.map((item) => item.title)).toEqual([
      "Item one",
      "Item two",
      "Item three",
    ]);
  });

  it("gets one item by id", async () => {
    await expect(itemApi.get("2")).resolves.toEqual({
      id: "2",
      title: "Item two",
      description: "Description of item two",
    });
  });

  it("resolves null for an id that does not exist", async () => {
    await expect(itemApi.get("999")).resolves.toBeNull();
  });
});

describe("the item API on the HTTP source", () => {
  function apiAnswering(fetchFn: jest.Mock) {
    const client = createHttpClient("https://api.example.com", fetchFn);
    return createItemApi(createHttpItemSource(client));
  }

  it("maps a backend list to items", async () => {
    const api = apiAnswering(
      jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([{ id: "7", name: "Seven", details: "7" }]),
      }),
    );

    await expect(api.list()).resolves.toEqual([
      { id: "7", title: "Seven", description: "7" },
    ]);
  });

  it("reports a backend list of the wrong shape as an invalid response", async () => {
    const api = apiAnswering(
      jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([{ id: "7" }]),
      }),
    );

    await expect(api.list()).rejects.toMatchObject({
      kind: "invalid-response",
    });
  });

  it("reports a dropped connection as a network error", async () => {
    const api = apiAnswering(jest.fn().mockRejectedValue(new TypeError("x")));

    await expect(api.list()).rejects.toMatchObject({ kind: "network" });
  });
});

describe("the item API and cancellation", () => {
  it("hands the abort signal to the source", async () => {
    const source = {
      list: jest.fn().mockResolvedValue([]),
      get: jest.fn().mockResolvedValue(null),
    };
    const api = createItemApi(source);
    const { signal } = new AbortController();

    await api.list(signal);
    await api.get("2", signal);

    expect(source.list).toHaveBeenCalledWith(signal);
    expect(source.get).toHaveBeenCalledWith("2", signal);
  });
});
