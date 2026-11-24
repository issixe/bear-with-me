import { AddLessonOutputBoundary } from "../../application/use_cases/AddLesson/AddLessonOutputBoundary.js";

export class AddLessonPresenter extends AddLessonOutputBoundary {
    constructor(viewModel) {
        super();
        this.viewModel = viewModel;
    }

    prepareSuccessView(out) {
        this.viewModel.httpStatus = 201;
        this.viewModel.body = {
            lessonId: out.lessonId,
            moduleId: out.moduleId,
        };
    }

    prepareFailView({ reason, message }) {
        this.viewModel.httpStatus = reason === "duplicate" ? 409 : 400;
        this.viewModel.body = { error: message };
    }
}
