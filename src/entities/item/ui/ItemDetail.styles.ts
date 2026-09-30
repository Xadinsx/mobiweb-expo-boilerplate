import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: "600",
    color: theme.colors.text,
  },
  description: {
    fontSize: theme.fontSize.body,
    color: theme.colors.mutedText,
  },
}));
