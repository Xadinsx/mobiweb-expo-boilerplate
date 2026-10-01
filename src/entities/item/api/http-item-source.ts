import type { ItemSource } from "./item-source";
import { ApiError } from "@/shared/api";

type JsonClient = { get(path: string): Promise<unknown> };

/** Reads items from a backend with `GET /items` and `GET /items/<id>`. */
export function createHttpItemSource(client: JsonClient): ItemSource {
  return {
    list: () => client.get("/items"),
    get: async (id) => {
      try {
        return await client.get(`/items/${encodeURIComponent(id)}`);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
  };
}
