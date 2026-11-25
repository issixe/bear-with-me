import { CompleteLessonOutputBoundary } from "../../application/use_cases/CompleteLesson/CompleteLessonOutputBoundary.js";
import { CompleteLessonOutputBoundary } from
    "../../application/use_cases/CompleteLesson/CompleteLessonOutputBoundary.js";

export class CompleteLessonPresenter extends CompleteLessonOutputBoundary {
    async present(out) {
        return {
            userId: out.userId,
            sessionId: out.sessionId,
            streak: out.streak,
            sessionScore: out.sessionScore,
            totalPoints: out.totalPoints,
        };
    }
}
