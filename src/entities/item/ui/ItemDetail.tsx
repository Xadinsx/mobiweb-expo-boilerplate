import { Text, View } from "react-native";

import type { Item } from "../model/item";

import { styles } from "./ItemDetail.styles";

type Props = {
  item: Item;
};

export function ItemDetail({ item }: Props) {
  return (
    <View style={styles.container}>
      <Text testID="detail-title-text" style={styles.title}>
        {item.title}
      </Text>
      <Text testID="detail-description-text" style={styles.description}>
        {item.description}
      </Text>
    </View>
  );
}
