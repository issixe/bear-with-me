import { ListLessonsOutputBoundary }
  from "../../application/use_cases/listLessons/listLessonsOutputBoundary.js";

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

  prepareFailView(errorMessage) {
    this.viewModel.httpStatus = 404;
    this.viewModel.body = { error: errorMessage };
  }
}