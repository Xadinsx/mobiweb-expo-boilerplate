import type { Item } from "../model/item";
import { mockItemSource } from "./mock-item-source";
import type { ItemSource } from "./item-source";
import { toItem, toItems } from "./to-item";

export function createItemApi(source: ItemSource) {
  return {
    list: async (signal?: AbortSignal): Promise<Item[]> =>
      toItems(await source.list(signal)),
    /** Resolves null when the item does not exist. */
    get: async (id: string, signal?: AbortSignal): Promise<Item | null> => {
      const body = await source.get(id, signal);
      return body === null ? null : toItem(body);
    },
  };
}

// The sample runs on the mock. A project with a backend passes
// createHttpItemSource(createHttpClient(vendor.backend.apiBaseUrl, fetch)) here instead.
export const itemApi = createItemApi(mockItemSource);
