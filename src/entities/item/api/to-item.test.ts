import { toItem, toItems } from "./to-item";
import { ApiError } from "@/shared/api";

describe("toItem", () => {
  it("maps the backend's field names to the app's item", () => {
    expect(
      toItem({ id: "1", name: "Item one", details: "Description of item one" }),
    ).toEqual({
      id: "1",
      title: "Item one",
      description: "Description of item one",
    });
  });

  it("rejects a body that is missing a field as an invalid response", () => {
    expect(() => toItem({ id: "1", name: "Item one" })).toThrow(ApiError);
    expect(() => toItem({ id: "1", name: "Item one" })).toThrow(
      expect.objectContaining({ kind: "invalid-response" }),
    );
  });

  it("rejects a field of the wrong type as an invalid response", () => {
    expect(() => toItem({ id: 1, name: "Item one", details: "x" })).toThrow(
      expect.objectContaining({ kind: "invalid-response" }),
    );
  });
});

describe("toItems", () => {
  it("maps every entry of a list body", () => {
    const body = [
      { id: "1", name: "A", details: "a" },
      { id: "2", name: "B", details: "b" },
    ];

    expect(toItems(body).map((item) => item.title)).toEqual(["A", "B"]);
  });

  it("rejects a body that is not a list as an invalid response", () => {
    expect(() => toItems({ items: [] })).toThrow(
      expect.objectContaining({ kind: "invalid-response" }),
    );
  });
});
