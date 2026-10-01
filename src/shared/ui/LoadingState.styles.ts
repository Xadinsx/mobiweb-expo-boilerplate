import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: "center",
  },
  text: {
    fontSize: theme.fontSize.body,
    color: theme.colors.mutedText,
  },
}));
