import { CompleteLessonOutputBoundary } from '../../application/use_cases/CompleteLesson/CompleteLessonOutputBoundary.js';

export class CompleteLessonPresenter extends CompleteLessonOutputBoundary {
    async present(outputData) {
        return {
            agentId: outputData.agentId,
            sessionId: outputData.sessionId,
            streak: outputData.streak,
            totalPoints: outputData.totalPoints,
            completedModules: outputData.completedModules // not sure about this one, too many properties of similar names...
        };
    }
}