import { apiClient } from "../../infrastructure/http/apiClient";

export const sessionService = {
  start({ userId, lessonId }) {
    return apiClient.post("/sessions", { userId, lessonId });
  },
  submitAnswer({ sessionId, userId, moduleId, stageId, answerId }) {
    return apiClient.post(
      `/sessions/${encodeURIComponent(sessionId)}/answers`,
      { userId, moduleId, stageId, answerId },
    );
  },
  complete({ sessionId, userId, username, sessionScore }) {
    return apiClient.post(
      `/sessions/${encodeURIComponent(sessionId)}/complete`,
      { userId, username, sessionScore },
    );
  },
};
