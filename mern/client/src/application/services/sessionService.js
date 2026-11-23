import { apiClient } from "../../infrastructure/http/apiClient";

export const sessionService = {
    // start a new attempt 

    start({ agentId, lessonId }) {
    return apiClient.post("/sessions", { agentId, lessonId });
    },


    // submit answer (choose one of the answer options)
    submitAnswer({ sessionId, userId, moduleId, stageId, answerId }) {
    
    return apiClient.post(
        `/sessions/${encodeURIComponent(sessionId)}/answers`,
        { userId, moduleId, stageId, answerId },
        );
    },
};
