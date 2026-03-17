import { useEffect, useState } from "react";
import { sendLargeMessage, sendSmallMessage } from "../api";
import { useLoggerStore } from "../logger/useLoggerStore";
import { useHighPriorityQueueStore } from "./useHighPriorityQueueStore";
import { useLowPriorityQueueStore } from "./useLowPriorityQueueStore";

const RETRY_DELAY = 5000; // 5 seconds

export const useConsumer = () => {
  const smallItemToProceed = useHighPriorityQueueStore(
    (state) => state.items?.[0],
  );
  const largeItemToProceed = useLowPriorityQueueStore(
    (state) => state.items?.[0],
  );
  const removeSmallItemById = useHighPriorityQueueStore(
    (state) => state.removeById,
  );
  const removeLargeItemById = useLowPriorityQueueStore(
    (state) => state.removeById,
  );

  const [retryTrigger, setRetryTrigger] = useState(0);

  const addLog = useLoggerStore((state) => state.addLog);

  useEffect(() => {
    if (smallItemToProceed) {
      sendSmallMessage(smallItemToProceed.payload)
        .then(() => {
          removeSmallItemById(smallItemToProceed.id);
          addLog("SMALL");
        })
        .catch((error) => {
          setTimeout(() => setRetryTrigger((prev) => prev + 1), RETRY_DELAY);
        });
    } else if (largeItemToProceed) {
      sendLargeMessage(largeItemToProceed.payload)
        .then(() => {
          removeLargeItemById(largeItemToProceed.id);
          addLog("LARGE");
        })
        .catch((error) => {
          setTimeout(() => setRetryTrigger((prev) => prev + 1), RETRY_DELAY);
        });
    }
  }, [
    smallItemToProceed,
    largeItemToProceed,
    removeSmallItemById,
    removeLargeItemById,
    retryTrigger,
    addLog,
  ]);
};
