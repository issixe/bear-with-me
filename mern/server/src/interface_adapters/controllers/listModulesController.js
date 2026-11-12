import { ListModulesInputData } from "../../application/use_cases/listModules/listModulesInputData.js";

export class ListModulesController {
  constructor(inputBoundary) {
    this.inputBoundary = inputBoundary;
  }

  execute() {
    return this.inputBoundary.execute(new ListModulesInputData());
  }
}
