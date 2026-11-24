import { apiClient } from "../../infrastructure/http/apiClient";

export const sessionService = {
  start: ({ agentId, lessonId }) =>
    apiClient.post("/sessions", { agentId, lessonId }),
};
