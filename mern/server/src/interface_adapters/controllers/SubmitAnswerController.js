import { SubmitAnswerInputData } from "../../application/use_cases/SubmitAnswer/SubmitAnswerInputData.js";
export class SubmitAnswerController {
    constructor(InputBoundary) {
        this.InputBoundary = InputBoundary;
    } 

    // initalize the input data and pass it to the use case interactor
    execute(answerData) {
        const inputData = new SubmitAnswerInputData(
            answerData.userId,
            answerData.sessionId,
            answerData.stageId,
            answerData.answerId,
            answerData.moduleId
        );
        
        return this.InputBoundary.execute(inputData);
    } // SubmitAnswerInputData requires userId, sessionId, stageId, answerId
}
