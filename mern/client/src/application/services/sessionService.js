import { apiClient } from "../../infrastructure/http/apiClient";

export const sessionService = {
  start: ({ userId, lessonId }) =>
    apiClient.post("/sessions", { userId, lessonId }),
};
