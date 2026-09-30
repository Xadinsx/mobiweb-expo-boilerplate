import { vendor } from "../vendor";

import { createThemes, resolveInitialScheme } from "./create-themes";

const both = vendor.schemes;
const lightOnly = {
  supported: ["light" as const],
  default: "light" as const,
  userChoice: false,
};

describe("createThemes", () => {
  it("builds a theme for each supported scheme from the vendor's palette", () => {
    const themes = createThemes(vendor);

    expect(themes.light?.colors).toEqual(vendor.look.palettes.light);
    expect(themes.dark?.colors).toEqual(vendor.look.palettes.dark);
  });

  it("builds only the schemes the vendor supports", () => {
    const themes = createThemes({ look: vendor.look, schemes: lightOnly });

    expect(Object.keys(themes)).toEqual(["light"]);
  });
});

describe("resolveInitialScheme", () => {
  it("uses the stored choice when users may choose and it is supported", () => {
    expect(resolveInitialScheme(both, "dark")).toBe("dark");
  });

  it("uses the vendor default when nothing was stored", () => {
    expect(resolveInitialScheme(both, undefined)).toBe("light");
  });

  it("ignores a stored choice that is not a supported scheme", () => {
    expect(resolveInitialScheme(lightOnly, "dark")).toBe("light");
    expect(resolveInitialScheme(both, "purple")).toBe("light");
  });

  it("ignores a stored choice when the vendor does not let users choose", () => {
    const fixed = {
      supported: ["light" as const, "dark" as const],
      default: "dark" as const,
      userChoice: false,
    };

    expect(resolveInitialScheme(fixed, "light")).toBe("dark");
  });
});
