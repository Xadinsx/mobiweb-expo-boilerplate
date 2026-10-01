import { Link, Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { QueryProvider } from "../server-state";

export function RootLayout() {
  const { t } = useTranslation();

  return (
    <QueryProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: t("items.title"),
            headerRight: () => (
              <Link
                href="/settings"
                testID="items-settings-link"
                accessibilityLabel={t("items.settingsLink")}
              >
                {t("items.settingsLink")}
              </Link>
            ),
          }}
        />
        <Stack.Screen
          name="item/[id]"
          options={{ title: t("itemDetail.title") }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: t("settings.title") }}
        />
      </Stack>
    </QueryProvider>
  );
}
