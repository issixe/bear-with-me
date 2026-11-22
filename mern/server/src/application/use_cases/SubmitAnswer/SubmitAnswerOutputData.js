export class SubmitAnswerOutputData {
    constructor({
        sessionId,
        cScore,
        earnedScore,
        status,
        stageId,
        customerMood,
        customerResponse,
        answerOptions,
        pipWords,
    }) {
        this.sessionId = sessionId;
        this.cScore = cScore;
        this.earnedScore = earnedScore;
        this.status = status;
        this.isFinished = status !== "in_progress"; // indicates whether or not reaches the end of the lesson 
        this.stageId = stageId;
        this.customerMood = customerMood; // indicates the customer response and the emoji face 
        this.customerResponse = customerResponse; // indicares the response text 
        this.answerOptions = answerOptions; // indicates answer options 
        this.pipWords = pipWords;
    }
}