/** Where item data comes from. Both methods return the backend's raw body. */
export type ItemSource = {
  list(signal?: AbortSignal): Promise<unknown>;
  /** Resolves null when the item does not exist. */
  get(id: string, signal?: AbortSignal): Promise<unknown>;
};
