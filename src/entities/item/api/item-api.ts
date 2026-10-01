import type { Item } from "../model/item";
import { mockItemSource } from "./mock-item-source";
import type { ItemSource } from "./item-source";
import { toItem, toItems } from "./to-item";

export function createItemApi(source: ItemSource) {
  return {
    list: async (): Promise<Item[]> => toItems(await source.list()),
    /** Resolves null when the item does not exist. */
    get: async (id: string): Promise<Item | null> => {
      const body = await source.get(id);
      return body === null ? null : toItem(body);
    },
  };
}

// The sample runs on the mock. A project with a backend passes
// createHttpItemSource(createHttpClient(vendor.backend.apiBaseUrl, fetch)) here instead.
export const itemApi = createItemApi(mockItemSource);
