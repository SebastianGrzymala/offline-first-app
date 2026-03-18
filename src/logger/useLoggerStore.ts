import { create } from "zustand";

type LogEntry = {
  timestamp: string;
  message: string;
};

type LoggerStore = {
  messages: LogEntry[];
  addMessage: (message: string) => void;
  clearLogs: () => void;
};

export const useLoggerStore = create<LoggerStore>()((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        { timestamp: new Date().toISOString(), message },
        ...state.messages,
      ].slice(0, 100),
    })),
  clearLogs: () => set({ messages: [] }),
}));
