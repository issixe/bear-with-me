import { listModulesOutputBoundary } from
    "../../application/use_cases/listModules/listModulesOutputBoundary.js";
export class listModulesPresenter extends listModulesOutputBoundary {
    constructor(viewModel) {
        super();
        this.viewModel = viewModel;
    }

    prepareSuccessView(out) {
        this.viewModel.httpStatus = 200;
        this.viewModel.body = { modules: out.modules };
    }

    prepareFailView(msg) {
        this.viewModel.httpStatus = 500;
        this.viewModel.body = { error: msg };
    }
}