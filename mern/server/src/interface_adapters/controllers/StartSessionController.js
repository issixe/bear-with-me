import { StartSessionInputData } from "../../application/use_cases/StartSession/StartSessionInputData.js";

export class StartSessionController {
    constructor(inputBoundary) {
        this.inputBoundary = inputBoundary;
    }

    execute(userId, lessonId) {
        return this.inputBoundary.execute(
            new StartSessionInputData({ userId, lessonId }),
        );
    }
}
