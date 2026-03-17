import { makeQueueStore } from "./makeQueueStore";

export const useHighPriorityQueueStore = makeQueueStore("high-priority-store");
