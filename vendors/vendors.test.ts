import {
  buildExpoConfig,
  loadVendor,
  validateVendor,
  vendorNames,
} from "../app.config";

describe("vendors", () => {
  it.each(vendorNames())(
    "builds an app config for the %s vendor under Node",
    (name) => {
      const vendor = loadVendor(name);
      const config = buildExpoConfig(name);

      expect(config.name).toBe(vendor.identity.name);
      expect(config.scheme).toBe(vendor.identity.scheme);
      expect(config.ios?.bundleIdentifier).toBe(vendor.identity.iosBundleId);
      expect(config.android?.package).toBe(vendor.identity.androidPackage);
    },
  );

  it("uses the shared EAS project when a vendor has none of its own", () => {
    const config = buildExpoConfig("default");

    expect(config.extra?.eas.projectId).toBeTruthy();
    expect(config.owner).toBeTruthy();
  });

  it("names the vendors that exist when the variant is unknown", () => {
    expect(() => buildExpoConfig("nope")).toThrow(
      /Unknown APP_VARIANT "nope".*default/,
    );
  });

  it("rejects a vendor whose default language is not one it supports", () => {
    const vendor = loadVendor("default");

    expect(() =>
      validateVendor("broken", {
        ...vendor,
        languages: { ...vendor.languages, supported: ["en"], default: "pt" },
      }),
    ).toThrow(/languages.default must be one of languages.supported/);
  });

  it("rejects a vendor with no palette for a scheme it supports", () => {
    const vendor = loadVendor("default");

    expect(() =>
      validateVendor("broken", {
        ...vendor,
        look: { palettes: { light: vendor.look.palettes.light } },
      }),
    ).toThrow(/look.palettes.dark.background must be text/);
  });

  it("rejects a vendor with a field of the wrong kind", () => {
    const vendor = loadVendor("default");

    expect(() =>
      validateVendor("broken", { ...vendor, backend: { apiBaseUrl: 42 } }),
    ).toThrow(/backend.apiBaseUrl must be text/);
  });

  it("gives every vendor its own name and store ids", () => {
    const vendors = vendorNames().map((name) => loadVendor(name).identity);

    for (const key of [
      "name",
      "scheme",
      "iosBundleId",
      "androidPackage",
    ] as const) {
      const values = vendors.map((identity) => identity[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });
});
