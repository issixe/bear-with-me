// 1. user id: check session belongs to this user
// 2. session id: find the training attempt
// 3. answer id: find the selected answer such as "A"
// 4. check that the user is answering in the current stage of the lesson
// Use case interactor usee these inputs to do its job.

export class SubmitAnswerInputData {
    constructor(userId, sessionId, stageId, answerId, moduleId) {
        this.userId = userId; // the current user
        this.sessionId = sessionId; // the current taining attempt
        this.stageId = stageId; // the current stage user is in for the lesson
        this.answerId = answerId; // the answer user selected for the current stage
        this.moduleId = moduleId; // the module that the lesson belongs to
    }
}
