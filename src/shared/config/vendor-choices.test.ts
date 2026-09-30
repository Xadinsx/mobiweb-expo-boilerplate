// setTheme and setLanguage are bound to the vendor this build is for, so these tests load
// them, and the storage they write to, together with a different vendor.
const base = require("../../../vendors/default/vendor.json");

function loadWithVendor(overrides: object) {
  jest.resetModules();
  jest.doMock("@vendor/vendor.json", () => ({ ...base, ...overrides }));
  return {
    storage: (require("../lib") as typeof import("../lib")).storage,
    theme: require("./theme/theme") as typeof import("./theme/theme"),
    i18n: require("./i18n/i18n") as typeof import("./i18n/i18n"),
  };
}

afterEach(() => {
  jest.dontMock("@vendor/vendor.json");
});

describe("vendor choices", () => {
  it("stores a language change when the vendor lets users choose", () => {
    const { i18n, storage } = loadWithVendor({});

    i18n.setLanguage("pt");

    expect(storage.getString("language")).toBe("pt");
  });

  it("ignores a language change when the vendor does not let users choose", () => {
    const { i18n, storage } = loadWithVendor({
      languages: { supported: ["en", "pt"], default: "en", userChoice: false },
    });

    i18n.setLanguage("pt");

    expect(storage.getString("language")).toBeUndefined();
  });

  it("stores a scheme change when the vendor supports it", () => {
    const { theme, storage } = loadWithVendor({});

    theme.setTheme("dark");

    expect(storage.getString("theme")).toBe("dark");
  });

  it("ignores a scheme change the vendor does not support", () => {
    const { theme, storage } = loadWithVendor({
      schemes: { supported: ["light"], default: "light", userChoice: true },
    });

    theme.setTheme("dark");

    expect(storage.getString("theme")).toBeUndefined();
  });

  it("refuses to start when the vendor lists a language that has no translation", () => {
    expect(() =>
      loadWithVendor({
        languages: { supported: ["en", "xx"], default: "en", userChoice: true },
      }),
    ).toThrow(/no translation: xx/);
  });
});
