import { Redirect, useLocalSearchParams } from "expo-router";

import { ItemDetail, items } from "@/entities/item";

export function ItemDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = items.find((candidate) => candidate.id === id);

  if (!item) {
    return <Redirect href="/" />;
  }

  return <ItemDetail item={item} />;
}
