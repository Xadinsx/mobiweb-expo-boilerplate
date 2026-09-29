import { ItemsList } from "../features/items/ItemsList";
import { items } from "../features/items/items";

export default function ItemsScreen() {
  return <ItemsList items={items} />;
}
