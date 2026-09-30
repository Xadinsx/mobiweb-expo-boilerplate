import { createMMKV } from "react-native-mmkv";

type StorageKey = "theme" | "language";

const mmkv = createMMKV();

export const storage = {
  getString: (key: StorageKey) => mmkv.getString(key),
  setString: (key: StorageKey, value: string) => mmkv.set(key, value),
};
