import { useQuery } from "@tanstack/react-query";

import { itemApi } from "../api/item-api";

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: ({ signal }) => itemApi.list(signal),
  });
}
