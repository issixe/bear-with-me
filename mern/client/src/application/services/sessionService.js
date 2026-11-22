import { apiClient } from "../../infrastructure/http/apiClient";

export const sessionService = {
    submitAnswer({ sessionId, userId, moduleId, stageId, answerId }) {
    
    return apiClient.post(
        `/sessions/${encodeURIComponent(sessionId)}/answers`,
        { userId, moduleId, stageId, answerId },
        );
    },
};