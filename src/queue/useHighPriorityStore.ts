import { makeQueueStore } from './makeQueueStore';

export const useHighPriorityStore = makeQueueStore('high-priority-store');
