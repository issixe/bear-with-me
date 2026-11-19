import {SubmitAnswerInputData} from "../../use_cases/submit_answer/SubmitAnswerInputData.js";

export class SubmitAnswerController {
    constructor(InputBoundary) {
        this.InputBoundary = InputBoundary;
    } 

    // initalize the input data and pass it to the use case interactor
    execute(answerData) {
        return this.InputBoundary.execute(new SubmitAnswerInputData(answerData));
    } // SubmitAnswerInputData requires userId, sessionId, stageId, answerId
}
