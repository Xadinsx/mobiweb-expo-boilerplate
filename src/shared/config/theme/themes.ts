import { fontSize, radius, spacing } from "./tokens";

const tokens = { spacing, radius, fontSize };

export const lightTheme = {
  ...tokens,
  colors: {
    background: "#ffffff",
    text: "#111111",
    mutedText: "#555555",
    border: "#cccccc",
    accent: "#0a7ea4",
  },
} as const;

export const darkTheme = {
  ...tokens,
  colors: {
    background: "#121212",
    text: "#f2f2f2",
    mutedText: "#aaaaaa",
    border: "#333333",
    accent: "#4fc3f7",
  },
} as const;
