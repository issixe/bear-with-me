<<<<<<< HEAD
import { CompleteLessonOutputBoundary } from "../../application/use_cases/CompleteLesson/CompleteLessonOutputBoundary.js";

export class CompleteLessonPresenter extends CompleteLessonOutputBoundary {
    async present(outputData) {
        return {
            agentId: outputData.agentId,
            sessionId: outputData.sessionId,
            streak: outputData.streak,
            totalPoints: outputData.totalPoints,
            completedModules: outputData.completedModules, // not sure about this one, too many properties of similar names...
        };
    }
}
=======
import { CompleteLessonOutputBoundary } from
    "../../application/use_cases/CompleteLesson/CompleteLessonOutputBoundary.js";

export class CompleteLessonPresenter extends CompleteLessonOutputBoundary {
    constructor(viewModel) {
        super();
        this.viewModel = viewModel;
    }

    prepareSuccessView(out) {
        this.viewModel.httpStatus = 200;
        this.viewModel.body = {
            userId: out.userId,
            sessionId: out.sessionId,
            streak: out.streak,
            totalPoints: out.totalPoints,
            completedModules: out.completedModules
        };
    }

    prepareFailView(msg) {
        this.viewModel.httpStatus = 500;
        this.viewModel.body = { error: msg };
    }
}
>>>>>>> 7846f4f (feat: adds routing for GetLeaderboard and CompleteLesson)
