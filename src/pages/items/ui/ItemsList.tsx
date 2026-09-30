import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, Text } from "react-native";

import { styles } from "./ItemsList.styles";
import type { Item } from "@/entities/item";

type Props = {
  items: Item[];
};

export function ItemsList({ items }: Props) {
  const { t } = useTranslation();

  return (
    <FlatList
      testID="items-main-list"
      data={items}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <Text testID="items-empty-text" style={styles.empty}>
          {t("items.empty")}
        </Text>
      }
      renderItem={({ item }) => (
        <Pressable
          testID={`items-row-${item.id}-button`}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          style={styles.row}
          onPress={() => router.push(`/item/${item.id}`)}
        >
          <Text style={styles.title}>{item.title}</Text>
        </Pressable>
      )}
    />
  );
}
