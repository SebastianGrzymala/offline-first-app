import { create } from "zustand";

type LogEntry = {
  timestamp: string;
  payload: string;
};

type LoggerStore = {
  logs: LogEntry[];
  addLog: (payload: string) => void;
  clearLogs: () => void;
};

export const useLoggerStore = create<LoggerStore>()((set) => ({
  logs: [],
  addLog: (payload) =>
    set((state) => ({
      logs: [
        { timestamp: new Date().toISOString(), payload },
        ...state.logs,
      ].slice(0, 100),
    })),
  clearLogs: () => set({ logs: [] }),
}));
