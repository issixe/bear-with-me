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
            sessionScore: out.sessionScore,
            totalPoints: out.totalPoints,
        };
    }

    prepareFailView(msg) {
        this.viewModel.httpStatus = 500;
        this.viewModel.body = { error: msg };
    }
}
