import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { styles } from "./LoadingState.styles";

type Props = {
  /** The screen's test id prefix, for example "items" gives "items-loading-text". */
  testIdPrefix: string;
};

export function LoadingState({ testIdPrefix }: Props) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.colors.accent} />
      <Text testID={`${testIdPrefix}-loading-text`} style={styles.text}>
        {t("request.loading")}
      </Text>
    </View>
  );
}
