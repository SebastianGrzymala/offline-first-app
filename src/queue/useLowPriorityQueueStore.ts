import { makeQueueStore } from "./makeQueueStore";

export const useLowPriorityQueueStore = makeQueueStore("low-priority-store");
