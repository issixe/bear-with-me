import { ListLessonsOutputBoundary } from '../../application/use_cases/ListLessons/ListLessonsOutputBoundary.js';

export class ListLessonsPresenter extends listLessonsOutputBoundary {
    constructor(viewModel) {
        super();
        this.viewModel = viewModel;
    }

    prepareSuccessView(out) {
        this.viewModel.httpStatus = 200;
        this.viewModel.body = { moduleId: out.moduleId, lessons: out.lessons };
    }

    prepareFailView(msg) {
        this.viewModel.httpStatus = 404;
        this.viewModel.body = { error: msg };
    }
}