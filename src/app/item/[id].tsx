import { Redirect, useLocalSearchParams } from "expo-router";

import { ItemDetail } from "../../features/items/ItemDetail";
import { items } from "../../features/items/items";

export default function ItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = items.find((candidate) => candidate.id === "1");

  if (!item) {
    return <Redirect href="/" />;
  }

  return <ItemDetail item={item} />;
}
