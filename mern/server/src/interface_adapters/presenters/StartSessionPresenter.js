import { StartSessionOutputBoundary } from "../../application/use_cases/StartSession/StartSessionOutputBoundary.js";

export class StartSessionPresenter extends StartSessionOutputBoundary {
    constructor(viewModel) {
        super();
        this.viewModel = viewModel;
    }

    prepareSuccessView(outputData) {
        this.viewModel.httpStatus = 200;
        this.viewModel.body = {
            sessionId: outputData.sessionId,
            lessonId: outputData.lessonId,
            title: outputData.title,
            moduleId: outputData.moduleId,
            moduleTitle: outputData.moduleTitle,
            stageCount: outputData.stageCount,
            stage: outputData.stage,
            customerMood: outputData.customerMood,
            customerResponse: outputData.customerResponse,
            pipWords: outputData.pipWords,
            options: outputData.options,
        };
    }

    prepareFailView(msg) {
        this.viewModel.httpStatus = 404;
        this.viewModel.body = { error: msg };
    }
}
