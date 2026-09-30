import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
  },
  options: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  option: (selected: boolean) => ({
    borderWidth: 1,
    borderColor: selected ? theme.colors.accent : theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  }),
}));
