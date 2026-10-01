/** Where item data comes from. Both methods return the backend's raw body. */
export type ItemSource = {
  list(): Promise<unknown>;
  /** Resolves null when the item does not exist. */
  get(id: string): Promise<unknown>;
};
