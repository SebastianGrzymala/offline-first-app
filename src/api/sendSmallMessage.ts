import { api } from "./client";

export const sendSmallMessage = async (message: unknown) =>
  api.post("/api", { message });
