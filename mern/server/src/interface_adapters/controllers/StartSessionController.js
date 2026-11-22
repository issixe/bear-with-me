import { StartSessionInputData } from "../../application/use_cases/StartSession/StartSessionInputData.js";

export class StartSessionController {
  constructor(inputBoundary) {
    this.inputBoundary = inputBoundary;
  }

  execute(agentId, lessonId) {
    return this.inputBoundary.execute(
      new StartSessionInputData({ agentId, lessonId }),
    );
  }
}
