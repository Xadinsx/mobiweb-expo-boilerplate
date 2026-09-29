import { StyleSheet, Text, View } from 'react-native';

import type { Item } from './items';

type Props = {
  item: Item;
};

export function ItemDetail({ item }: Props) {
  return (
    <View style={styles.container}>
      <Text testID="detail-title-text" style={styles.title}>
        {item.title}
      </Text>
      <Text testID="detail-description-text">{item.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});
