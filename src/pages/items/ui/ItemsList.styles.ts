import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  row: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
  },
  empty: {
    padding: theme.spacing.md,
    color: theme.colors.mutedText,
  },
}));
