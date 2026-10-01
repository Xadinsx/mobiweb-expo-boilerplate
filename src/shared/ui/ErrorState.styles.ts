import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    alignItems: "center",
  },
  text: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
    textAlign: "center",
  },
  button: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: theme.radius.md,
  },
  buttonText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.accent,
  },
}));
