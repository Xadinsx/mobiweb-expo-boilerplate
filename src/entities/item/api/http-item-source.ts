import type { ItemSource } from "./item-source";
import { ApiError } from "@/shared/api";

type JsonClient = {
  get(path: string, signal?: AbortSignal): Promise<unknown>;
};

/** Reads items from a backend with `GET /items` and `GET /items/<id>`. */
export function createHttpItemSource(client: JsonClient): ItemSource {
  return {
    list: (signal) => client.get("/items", signal),
    get: async (id, signal) => {
      try {
        return await client.get(`/items/${encodeURIComponent(id)}`, signal);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
  };
}
