import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';

import type { Item } from './items';

type Props = {
  items: Item[];
};

export function ItemsList({ items }: Props) {
  return (
    <FlatList
      testID="items-main-list"
      data={items}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text testID="items-empty-text">No items yet</Text>}
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

const styles = StyleSheet.create({
  row: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
  },
});
