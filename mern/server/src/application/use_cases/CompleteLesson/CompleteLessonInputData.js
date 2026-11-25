export class CompleteLessonInputData {
  constructor({ userId, sessionId, username, sessionScore }) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.username = username;
    this.sessionScore = sessionScore;
  }
}
