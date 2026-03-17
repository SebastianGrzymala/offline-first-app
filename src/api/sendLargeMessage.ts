import { api } from "./client";

export const sendLargeMessage = async (message: unknown) => {
  const formData = new FormData();
  formData.append(
    "message",
    message instanceof Blob ? message : String(message),
  );

  return api.post("/api", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
