import { storage } from "../../lib";

import { getInitialTheme } from "./theme";

describe("getInitialTheme", () => {
  it("is light when nothing was stored", () => {
    storage.setString("theme", "");

    expect(getInitialTheme()).toBe("light");
  });

  it("is dark when dark was stored, so the choice survives a restart", () => {
    storage.setString("theme", "dark");

    expect(getInitialTheme()).toBe("dark");
  });

  it("is light when the stored value is not a theme name", () => {
    storage.setString("theme", "purple");

    expect(getInitialTheme()).toBe("light");
  });
});
