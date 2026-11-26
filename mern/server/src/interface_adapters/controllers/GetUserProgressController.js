import { GetUserProgressInputData } from "../../application/use_cases/GetUserProgress/GetUserProgressInputData.js";

export class GetUserProgressController {
    constructor(inputBoundary) {
        this.inputBoundary = inputBoundary;
    }

    execute(userId) {
        const inputData = new GetUserProgressInputData({ userId });
        return this.inputBoundary.execute(inputData);
    }
}
