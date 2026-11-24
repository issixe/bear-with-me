import { ListLessonsOutputBoundary } from "../../application/use_cases/ListLessons/ListLessonsOutputBoundary.js";

export class ListLessonsPresenter extends ListLessonsOutputBoundary {
  constructor(viewModel) {
    super();
    this.viewModel = viewModel;
  }

  prepareSuccessView(out) {
    this.viewModel.httpStatus = 200;
    this.viewModel.body = { moduleId: out.moduleId, lessons: out.lessons };
  }

  prepareFailView({ reason, message }) {
    this.viewModel.httpStatus = reason === "duplicate" ? 409 : 400;
    this.viewModel.body = { error: message };
  }
}
