import { ListLessonsOutputBoundary } from "../../application/use_cases/ListLessons/ListLessonsOutputBoundary.js";

export class ListLessonsPresenter extends ListLessonsOutputBoundary {
    constructor(viewModel) {
        super();
        this.viewModel = viewModel;
    }

    prepareSuccessView(outputData) {
        this.viewModel.httpStatus = 200;
        this.viewModel.body = {
            moduleId: outputData.moduleId,
            lessons: outputData.lessons,
        };
    }

    prepareFailView(msg) {
        this.viewModel.httpStatus = 404;
        this.viewModel.body = { error: msg };
    }
}
