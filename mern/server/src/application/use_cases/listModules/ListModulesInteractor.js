import { ListModulesInputBoundary } from './listModulesInputBoundary.js';
import { ListModulesOutputData } from './listModulesOutputData.js';
export class ListModulesInteractor extends ListModulesInputBoundary {
  constructor({ dataAccess, outputBoundary }) {
    super();
    this.dataAccess = dataAccess;
    this.outputBoundary = outputBoundary;
  }
  async execute() {
    try {
      const modules = await this.dataAccess.findAll();
      this.outputBoundary.prepareSuccessView(new ListModulesOutputData({ modules }));
    } catch {
      this.outputBoundary.prepareFailView("Could not load modules.");
    }
  }
}
