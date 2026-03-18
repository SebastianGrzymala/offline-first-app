import axios from "axios";
import { useLoggerStore } from "../logger/useLoggerStore";
import { useHighPriorityQueueStore } from "../queue/useHighPriorityQueueStore";
import { useLowPriorityQueueStore } from "../queue/useLowPriorityQueueStore";

export const DELAYED_MESSAGE_HEADER = "X-Delayed-Message";

export const api = axios.create({
  //baseURL: "http://localhost:3000", // Keep it in env variable
  baseURL: "https://offline-first-app.onrender.com",
});

const isFormData = (data: unknown): data is FormData =>
  data instanceof FormData;

api.interceptors.response.use(
  // Interceptor for logging successful messages
  (response) => {
    const rawData = response.config.data;
    const requestData = isFormData(rawData)
      ? Object.fromEntries(rawData as unknown as Iterable<[string, unknown]>)
      : JSON.parse(rawData ?? "{}");
    if (requestData?.message) {
      const isDelayed = !!response.config.headers?.[DELAYED_MESSAGE_HEADER];
      const prefix = isDelayed ? "[DELAYED]" : "[LIVE]";
      useLoggerStore.getState().addMessage(`${prefix} ${requestData.message}`);
    }
    return response;
  },
  // Interceptor for network error (no response received)
  (error) => {
    if (
      !error.response &&
      error.config &&
      !error.config.headers?.[DELAYED_MESSAGE_HEADER] // Prevent sending to queue if it's already a retried message
    ) {
      console.log("🌐 Network error: append query to queue");
      const { url, method, data } = error.config;

      if (isFormData(data)) {
        useLowPriorityQueueStore.getState().addMessage({
          id: Date.now().toString(),
          url,
          method,
          data: Object.fromEntries(
            data as unknown as Iterable<[string, unknown]>,
          ),
        });
      } else {
        useHighPriorityQueueStore.getState().addMessage({
          id: Date.now().toString(),
          url,
          method,
          data,
        });
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
