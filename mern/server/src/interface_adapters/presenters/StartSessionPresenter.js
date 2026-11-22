import { StartSessionOutputBoundary } from "../../application/use_cases/StartSession/StartSessionOutputBoundary.js";

export class StartSessionPresenter extends StartSessionOutputBoundary {
  constructor(viewModel) {
    super();
    this.viewModel = viewModel;
  }

  prepareSuccessView(out) {
    this.viewModel.httpStatus = 200;
    this.viewModel.body = {
      sessionId: sessionId,
      lessonId: out.lessonId,
      stage: out.stage,
      customerMood: out.customerMood,
    };
  }

  prepareFailView(msg) {
    this.viewModel.httpStatus = 404;
    this.viewModel.body = { error: msg };
  }
}
