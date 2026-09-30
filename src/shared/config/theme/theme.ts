import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

import { storage } from "../../lib";

import { darkTheme, lightTheme } from "./themes";

const themes = { light: lightTheme, dark: darkTheme };

type AppThemes = typeof themes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

type ThemeName = keyof AppThemes;

export function getInitialTheme(): ThemeName {
  return storage.getString("theme") === "dark" ? "dark" : "light";
}

StyleSheet.configure({
  themes,
  settings: { initialTheme: getInitialTheme },
});

export function setTheme(name: ThemeName) {
  UnistylesRuntime.setTheme(name);
  storage.setString("theme", name);
}
