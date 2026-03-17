import { useNetInfoInstance } from "@react-native-community/netinfo";
import { useCallback, useEffect, useRef, useState } from "react";
import { sendLargeMessage, sendSmallMessage } from "../api";
import { useLoggerStore } from "../logger/useLoggerStore";
import { useHighPriorityQueueStore } from "./useHighPriorityQueueStore";
import { useLowPriorityQueueStore } from "./useLowPriorityQueueStore";

const RETRY_DELAY = 5000; // 5 seconds

export const useConsumer = () => {
  const {
    netInfo: { isConnected },
  } = useNetInfoInstance();

  const [retryTrigger, setRetryTrigger] = useState(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const addLog = useLoggerStore((state) => state.addLog);

  const retry = useCallback(() => {
    retryTimeoutRef.current = setTimeout(
      () => setRetryTrigger((prev) => prev + 1),
      RETRY_DELAY,
    );
  }, []);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!smallItemToProceed || !isConnected) {
      return;
    }
    sendSmallMessage(smallItemToProceed.payload)
      .then(() => {
        removeSmallItemById(smallItemToProceed.id);
        addLog(JSON.stringify(smallItemToProceed.payload));
      })
      .catch((error) => {
        retry();
        console.error(error);
      });
  }, [
    smallItemToProceed,
    removeSmallItemById,
    retryTrigger,
    addLog,
    isConnected,
    retry,
  ]);

  useEffect(() => {
    if (smallItemToProceed || !largeItemToProceed || !isConnected) {
      return;
    }
    sendLargeMessage(largeItemToProceed.payload)
      .then(() => {
        removeLargeItemById(largeItemToProceed.id);
        addLog(JSON.stringify(largeItemToProceed.payload));
      })
      .catch((error) => {
        retry();
        console.error(error);
      });
  }, [
    smallItemToProceed,
    largeItemToProceed,
    removeLargeItemById,
    retryTrigger,
    addLog,
    isConnected,
    retry,
  ]);
};
