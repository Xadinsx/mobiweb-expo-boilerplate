import type { ItemSource } from "./item-source";

// What a backend would send, so the mapper in to-item.ts has real work to do.
const bodies = [
  { id: "1", name: "Item one", details: "Description of item one" },
  { id: "2", name: "Item two", details: "Description of item two" },
  { id: "3", name: "Item three", details: "Description of item three" },
];

/** Answers from memory, so the app and its device checks need no backend. */
export const mockItemSource: ItemSource = {
  list: () => Promise.resolve(bodies),
  get: (id) => Promise.resolve(bodies.find((body) => body.id === id) ?? null),
};
