import { ListModulesOutputBoundary } from
    "../../application/use_cases/ListModules/ListModulesOutputBoundary.js";

export class ListModulesPresenter extends ListModulesOutputBoundary {
    async present(outputData) {
        return {
            modules: outputData.modules
        };
    }
}