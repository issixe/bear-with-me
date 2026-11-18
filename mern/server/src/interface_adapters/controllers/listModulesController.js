import { ListModulesInputData } from "../../application/use_cases/ListModules/ListModulesInputData.js";

export class ListModulesController {
    constructor(inputBoundary) {
        this.inputBoundary = inputBoundary;
    }

    execute() {
        return this.inputBoundary.execute(new ListModulesInputData());
    }
}