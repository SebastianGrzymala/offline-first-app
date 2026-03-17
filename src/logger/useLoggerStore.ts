import { create } from "zustand";

type TactionType = "SMALL" | "LARGE";

type LogEntry = {
  timestamp: string;
  payload: string;
};

type LoggerStore = {
  logs: LogEntry[];
  addLog: (payload: TactionType) => void;
};

export const useLoggerStore = create<LoggerStore>()((set) => ({
  logs: [],
  addLog: (payload) =>
    set((state) => ({
      logs: [
        ...state.logs,
        { timestamp: new Date().toISOString(), payload },
      ].slice(0, 100),
    })),
}));
