import { apiClient } from "../../infrastructure/http/apiClient";

export const sessionService = {
  start: ({ userId, lessonId }) =>
    apiClient.post("/sessions", { userId, lessonId }),
  complete: ({ sessionId, userId, username, sessionScore }) =>
    apiClient.post(
      `/sessions/${encodeURIComponent(sessionId)}/complete`,
      { userId, username, sessionScore },
    ),
};
