import { GetUserProgressInputData } from "../../application/use_cases/GetUserProgress/GetUserProgressInputData.js";

export class GetUserProgressController {
    constructor(inputBoundary) {
        this.inputBoundary = inputBoundary;
    }

    execute(agentId) {
        const inputData = new GetUserProgressInputData({ agentId });
        return this.inputBoundary.execute(inputData);
    }
}
