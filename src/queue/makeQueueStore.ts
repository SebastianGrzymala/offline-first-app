import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type QueueItem = {
  id: string;
  payload: unknown;
};

type QueueStore = {
  items: QueueItem[];
  addItem: (item: QueueItem) => void;
  removeById: (id: string) => void;
};

// Factory function to create a queue store with persistence
export const makeQueueStore = (storageKey: string) =>
  create<QueueStore>()(
    persist(
      (set) => ({
        items: [],
        addItem: (item) => set((state) => ({ items: [...state.items, item] })),
        removeById: (id) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          })),
      }),
      {
        name: storageKey,
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  );
