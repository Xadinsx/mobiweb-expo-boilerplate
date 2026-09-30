import { useTranslation } from "react-i18next";
import { Image, Pressable, Switch, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { styles } from "./SettingsPage.styles";
import {
  type Language,
  setLanguage,
  setTheme,
  vendor,
  vendorLogo,
} from "@/shared/config";

const languages: {
  code: Language;
  labelKey: "settings.english" | "settings.portuguese";
}[] = [
  { code: "en", labelKey: "settings.english" },
  { code: "pt", labelKey: "settings.portuguese" },
];

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { rt } = useUnistyles();

  return (
    <View style={styles.container}>
      <Image
        testID="settings-logo-image"
        source={vendorLogo}
        accessibilityLabel={vendor.identity.name}
        style={styles.logo}
      />
      <View style={styles.row}>
        <Text style={styles.label}>{t("settings.theme")}</Text>
        <Switch
          testID="settings-theme-switch"
          accessibilityLabel={t("settings.theme")}
          value={rt.themeName === "dark"}
          onValueChange={(isDark) => setTheme(isDark ? "dark" : "light")}
        />
      </View>
      <View>
        <Text style={styles.label}>{t("settings.language")}</Text>
        <View style={styles.options}>
          {languages.map(({ code, labelKey }) => {
            const selected = i18n.language === code;
            return (
              <Pressable
                key={code}
                testID={`settings-language-${code}-button`}
                accessibilityRole="button"
                accessibilityLabel={t(labelKey)}
                accessibilityState={{ selected }}
                style={styles.option(selected)}
                onPress={() => setLanguage(code)}
              >
                <Text style={styles.label}>{t(labelKey)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
