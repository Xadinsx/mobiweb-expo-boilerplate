import { ItemsList } from "./ItemsList";
import { items } from "@/entities/item";

export function ItemsPage() {
  return <ItemsList items={items} />;
}
