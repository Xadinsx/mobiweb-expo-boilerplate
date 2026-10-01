import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { styles } from "./ErrorState.styles";

type Props = {
  /** The screen's test id prefix, for example "items" gives "items-error-text". */
  testIdPrefix: string;
  onRetry: () => void;
};

export function ErrorState({ testIdPrefix, onRetry }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text testID={`${testIdPrefix}-error-text`} style={styles.text}>
        {t("request.error")}
      </Text>
      <Pressable
        testID={`${testIdPrefix}-retry-button`}
        accessibilityRole="button"
        accessibilityLabel={t("request.retry")}
        style={styles.button}
        onPress={onRetry}
      >
        <Text style={styles.buttonText}>{t("request.retry")}</Text>
      </Pressable>
    </View>
  );
}
