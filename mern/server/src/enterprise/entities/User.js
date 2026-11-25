export class User {
    constructor({
        userId = null,
        username = null,
        totalPoints = 0,
        completedModules = [],
        streak = 0,
        lastActivity = null,
        lessonScores = {},
        pointsWeekStart = null,
    } = {}) {
        this.userId = userId;
        this.username = username;
        this.totalPoints = totalPoints;
        this.completedModules = [...completedModules];
        this.streak = streak;
        this.lastActivity = lastActivity;
        this.lessonScores = { ...lessonScores };
        this.pointsWeekStart = pointsWeekStart;
    }
}