import { ListModulesOutputBoundary } from "../../application/use_cases/listModules/ListModulesOutputBoundary.js";

export class ListModulesPresenter extends ListModulesOutputBoundary {
  constructor(viewModel) {
    super();
    this.viewModel = viewModel;
  }

  prepareSuccessView(outputData) {
    this.viewModel.httpStatus = 200;
    this.viewModel.body = {
      modules: outputData.modules,
    };
  }

  prepareFailView(errorMessage) {
    this.viewModel.httpStatus = 500;
    this.viewModel.body = {
      error: errorMessage,
    };
  }
}
