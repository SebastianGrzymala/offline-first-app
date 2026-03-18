import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Message = {
  id: string;
  url: string;
  method: string;
  data: unknown;
};

type QueueStore = {
  messages: Message[];
  addMessage: (message: Message) => void;
  removeMessage: (id: string) => void;
};

// Factory function to create a queue store with persistence
export const makeQueueStore = (storageKey: string) =>
  create<QueueStore>()(
    persist(
      (set) => ({
        messages: [],
        addMessage: (message) =>
          set((state) => ({ messages: [...state.messages, message] })),
        removeMessage: (id) =>
          set((state) => ({
            messages: state.messages.filter((item) => item.id !== id),
          })),
      }),
      {
        name: storageKey,
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  );
