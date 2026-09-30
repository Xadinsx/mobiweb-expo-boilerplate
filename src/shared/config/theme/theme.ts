import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

import { storage } from "../../lib";
import { type ColorScheme, vendor } from "../vendor";

import {
  createThemes,
  resolveInitialScheme,
  type Theme,
} from "./create-themes";

type AppThemes = Record<ColorScheme, Theme>;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  // Only the schemes the vendor supports exist at run time.
  themes: createThemes(vendor) as AppThemes,
  settings: {
    initialTheme: () =>
      resolveInitialScheme(vendor.schemes, storage.getString("theme")),
  },
});

/** Switches the scheme, when the vendor supports it and lets users choose. */
export function setTheme(scheme: ColorScheme) {
  if (
    !vendor.schemes.userChoice ||
    !vendor.schemes.supported.includes(scheme)
  ) {
    return;
  }
  UnistylesRuntime.setTheme(scheme);
  storage.setString("theme", scheme);
}
