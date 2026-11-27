import { GetUserProgressOutputBoundary } from "../../application/use_cases/GetUserProgress/GetUserProgressOutputBoundary.js";

export class GetUserProgressPresenter extends GetUserProgressOutputBoundary {
    constructor(viewModel) {
        super();
        this.viewModel = viewModel;
    }

    prepareSuccessView(outputData) {
        this.viewModel.httpStatus = 200;
        this.viewModel.body = {
            userId: outputData.userId,
            streak: outputData.streak,
            totalPoints: outputData.totalPoints,
            completedLessonIds: outputData.completedLessonIds,
        };
    }

    prepareFailView(msg) {
        this.viewModel.httpStatus = 400;
        this.viewModel.body = { error: msg };
    }
}
