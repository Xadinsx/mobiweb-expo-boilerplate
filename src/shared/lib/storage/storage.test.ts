import { storage } from "./storage";

describe("storage", () => {
  it("returns what was stored", () => {
    storage.setString("theme", "dark");

    expect(storage.getString("theme")).toBe("dark");
  });

  it("returns undefined for a key that was never set", () => {
    expect(storage.getString("language")).toBeUndefined();
  });
});
