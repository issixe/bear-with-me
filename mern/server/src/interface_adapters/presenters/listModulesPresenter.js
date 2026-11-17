import { listModulesOutputBoundary } from
    "../../application/use_cases/listModules/ListModulesOutputBoundary.js";
export class ListModulesPresenter extends ListModulesOutputBoundary {
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
