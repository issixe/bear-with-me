import { listModulesOutputBoundary } from
    "../../application/use_cases/listModules/listModulesOutputBoundary.js";

export class listModulesPresenter extends listModulesOutputBoundary {
    async present(outputData) {
        return {
            modules: outputData.modules
        };
    }
}