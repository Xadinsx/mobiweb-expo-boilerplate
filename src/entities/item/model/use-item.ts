import { useQuery } from "@tanstack/react-query";

import { itemApi } from "../api/item-api";

/** The item with this id, or null when there is none. */
export function useItem(id: string) {
  return useQuery({ queryKey: ["items", id], queryFn: () => itemApi.get(id) });
}
