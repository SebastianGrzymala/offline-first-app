import { useNetInfoInstance } from "@react-native-community/netinfo";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, DELAYED_MESSAGE_HEADER } from "../api/client";
import { useHighPriorityQueueStore } from "./useHighPriorityQueueStore";
import { useLowPriorityQueueStore } from "./useLowPriorityQueueStore";

const RETRY_DELAY = 5000; // 5 seconds

export const useConsumer = () => {
  const {
    netInfo: { isConnected },
  } = useNetInfoInstance();

  const [retryTrigger, setRetryTrigger] = useState(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const smallMessage = useHighPriorityQueueStore(
    (state) => state.messages?.[0],
  );
  const largeMessage = useLowPriorityQueueStore((state) => state.messages?.[0]);

  const removeSmallMessage = useHighPriorityQueueStore(
    (state) => state.removeMessage,
  );
  const removeLargeMessage = useLowPriorityQueueStore(
    (state) => state.removeMessage,
  );

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

  // Effect to process small messages
  useEffect(() => {
    if (!smallMessage || !isConnected) {
      return;
    }

    api({
      method: smallMessage.method,
      url: smallMessage.url,
      data: smallMessage.data,
      headers: { [DELAYED_MESSAGE_HEADER]: smallMessage.id },
    })
      .then(() => {
        removeSmallMessage(smallMessage.id);
      })
      .catch((error) => {
        retry();
        console.error(error);
      });
  }, [smallMessage, removeSmallMessage, retryTrigger, isConnected, retry]);

  // Effect to process large messages
  useEffect(() => {
    if (smallMessage || !largeMessage || !isConnected) {
      return;
    }

    const formData = new FormData();
    Object.entries(largeMessage.data as Record<string, unknown>).forEach(
      ([key, value]) => {
        formData.append(key, value as string);
      },
    );

    api({
      method: largeMessage.method,
      url: largeMessage.url,
      data: formData,
      headers: {
        [DELAYED_MESSAGE_HEADER]: largeMessage.id,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        removeLargeMessage(largeMessage.id);
      })
      .catch((error) => {
        retry();
        console.error(error);
      });
  }, [
    smallMessage,
    largeMessage,
    removeLargeMessage,
    retryTrigger,
    isConnected,
    retry,
  ]);
};
