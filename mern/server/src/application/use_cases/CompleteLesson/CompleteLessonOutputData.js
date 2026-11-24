export class CompleteLessonOutputData {
    constructor({ userId, sessionId, streak, sessionScore, totalPoints }) {
        this.userId = userId;
        this.sessionId = sessionId;
        this.streak = streak;
        this.sessionScore = sessionScore;
        this.totalPoints = totalPoints;
    }
}
