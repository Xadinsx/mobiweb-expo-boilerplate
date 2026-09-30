import { resolveInitialLanguage } from "./resolve-language";

const both = { supported: ["en", "pt"], default: "en", userChoice: true };
const portugueseOnly = { supported: ["pt"], default: "pt", userChoice: false };

describe("resolveInitialLanguage", () => {
  it("uses the stored language when users may choose and it is supported", () => {
    expect(resolveInitialLanguage(both, "pt", "en")).toBe("pt");
  });

  it("uses the device language when nothing usable was stored", () => {
    expect(resolveInitialLanguage(both, undefined, "pt")).toBe("pt");
  });

  it("uses the vendor default when neither the stored nor the device language is supported", () => {
    expect(resolveInitialLanguage(both, "fr", "es")).toBe("en");
    expect(resolveInitialLanguage(both, undefined, null)).toBe("en");
  });

  it("ignores a stored language the vendor does not ship", () => {
    expect(
      resolveInitialLanguage({ ...both, supported: ["en"] }, "pt", "en"),
    ).toBe("en");
  });

  it("ignores a stored language when the vendor does not let users choose", () => {
    expect(
      resolveInitialLanguage(
        { ...portugueseOnly, supported: ["en", "pt"], default: "en" },
        "pt",
        "pt",
      ),
    ).toBe("pt");
    expect(
      resolveInitialLanguage(
        { supported: ["en", "pt"], default: "en", userChoice: false },
        "pt",
        undefined,
      ),
    ).toBe("en");
  });

  it("works for a vendor with a single language", () => {
    expect(resolveInitialLanguage(portugueseOnly, "en", "en")).toBe("pt");
  });
});
