import { useTranslation } from "react-i18next";
import { Image, Pressable, Switch, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { styles } from "./SettingsPage.styles";
import {
  languageOptions,
  setLanguage,
  setTheme,
  vendor,
  vendorLogo,
  type VendorConfig,
} from "@/shared/config";

type Props = {
  /** The vendor to show settings for. The app uses the vendor this build is for. */
  config?: VendorConfig;
};

export function SettingsPage({ config = vendor }: Props) {
  const { t, i18n } = useTranslation();
  const { rt } = useUnistyles();

  const canSwitchTheme =
    config.schemes.userChoice && config.schemes.supported.length > 1;
  const languageChoices = config.languages.userChoice
    ? languageOptions(config.languages.supported)
    : [];
  const canSwitchLanguage = languageChoices.length > 1;

  return (
    <View style={styles.container}>
      <Image
        testID="settings-logo-image"
        source={vendorLogo}
        accessibilityLabel={config.identity.name}
        style={styles.logo}
      />
      {canSwitchTheme && (
        <View style={styles.row}>
          <Text style={styles.label}>{t("settings.theme")}</Text>
          <Switch
            testID="settings-theme-switch"
            accessibilityLabel={t("settings.theme")}
            value={rt.themeName === "dark"}
            onValueChange={(isDark) => setTheme(isDark ? "dark" : "light")}
          />
        </View>
      )}
      {canSwitchLanguage && (
        <View>
          <Text style={styles.label}>{t("settings.language")}</Text>
          <View style={styles.options}>
            {languageChoices.map(({ code, name }) => {
              const selected = i18n.language === code;
              return (
                <Pressable
                  key={code}
                  testID={`settings-language-${code}-button`}
                  accessibilityRole="button"
                  accessibilityLabel={name}
                  accessibilityState={{ selected }}
                  style={styles.option(selected)}
                  onPress={() => setLanguage(code)}
                >
                  <Text style={styles.label}>{name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
      {!canSwitchTheme && !canSwitchLanguage && (
        <Text testID="settings-nothing-text" style={styles.label}>
          {t("settings.nothingToChange")}
        </Text>
      )}
    </View>
  );
}
