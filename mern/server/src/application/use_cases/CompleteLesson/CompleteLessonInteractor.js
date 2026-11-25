import { CompleteLessonInputBoundary } from "./CompleteLessonInputBoundary.js";
import { CompleteLessonOutputData } from "./CompleteLessonOutputData.js";

export class CompleteLessonInteractor extends CompleteLessonInputBoundary {
    constructor({ dataAccess, presenter }) {
        super();
        this.dataAccess = dataAccess;
        this.presenter = presenter;
    }

    async execute({ userId, sessionId, username, sessionScore }) {
        if (!userId || !sessionId) {
            throw new Error("userId and sessionId are required");
        }
        if (!Number.isFinite(sessionScore) || sessionScore < 0) {
            throw new RangeError("Session score must be a non-negative number");
        }

        const session = await this.dataAccess.findSessionById(sessionId);
        if (!session) {
            throw new Error("session not found");
        }
        if (session.userId !== userId) {
            throw new Error("session does not belong to this user");
        }

        const user = await this.dataAccess.findOrCreateUser(userId, username);
        if (!user) {
            throw new Error("user not found");
        }

        session.cScore = sessionScore;
        user.recordLessonCompletion({
            sessionId: session.sessionId,
            sessionScore: session.cScore,
        });
        session.completed = true;

        await this.dataAccess.updateSession(session);
        await this.dataAccess.updateUser(user);

        const outputData = new CompleteLessonOutputData({
            userId: user.userId,
            sessionId: session.sessionId,
            streak: user.streak,
            sessionScore: session.cScore,
            totalPoints: user.totalPoints,
        });

        return this.presenter.present(outputData);
    }
}
