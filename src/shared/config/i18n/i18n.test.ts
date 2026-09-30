import { storage } from "../../lib";

import { getInitialLanguage } from "./i18n";

describe("getInitialLanguage", () => {
  it("uses the stored language, so the choice survives a restart", () => {
    storage.setString("language", "pt");

    expect(getInitialLanguage()).toBe("pt");
  });

  it("falls back to the device language, then to English", () => {
    storage.setString("language", "");

    expect(getInitialLanguage()).toBe("en");
  });
});
