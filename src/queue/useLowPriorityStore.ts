import { makeQueueStore } from './makeQueueStore';

export const useLowPriorityStore = makeQueueStore('low-priority-store');
