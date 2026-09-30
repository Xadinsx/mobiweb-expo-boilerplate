import type { ColorScheme, Palette, VendorConfig } from "../vendor";

import { fontSize, radius, spacing } from "./tokens";

const tokens = { spacing, radius, fontSize };

export type Theme = typeof tokens & { colors: Palette };

/** One theme for each color scheme the vendor supports, using the vendor's palette. */
export function createThemes({
  look,
  schemes,
}: Pick<VendorConfig, "look" | "schemes">): Partial<
  Record<ColorScheme, Theme>
> {
  const themes: Partial<Record<ColorScheme, Theme>> = {};
  for (const scheme of schemes.supported) {
    const palette = look.palettes[scheme];
    if (palette) {
      themes[scheme] = { ...tokens, colors: palette };
    }
  }
  return themes;
}

/** The stored choice if users may choose and it is supported, otherwise the vendor default. */
export function resolveInitialScheme(
  schemes: VendorConfig["schemes"],
  stored: string | undefined,
): ColorScheme {
  const isSupported = schemes.supported.some((scheme) => scheme === stored);
  return schemes.userChoice && isSupported
    ? (stored as ColorScheme)
    : schemes.default;
}
