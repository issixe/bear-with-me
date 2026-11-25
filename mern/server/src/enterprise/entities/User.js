function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function getWeekStartDateKey(date = new Date()) {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
        throw new RangeError("Week start requires a valid Date");
    }

    const monday = new Date(date);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return toDateKey(monday);
}

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

    recordLessonCompletion({ sessionId, sessionScore, date = new Date() }) {
        if (!sessionId) {
            throw new Error("Session ID is required");
        }
        if (!Number.isFinite(sessionScore) || sessionScore < 0) {
            throw new RangeError("Session score must be a non-negative number");
        }
        if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
            throw new RangeError("Completion date must be a valid Date");
        }

        const today = toDateKey(date);
        const yesterdayDate = new Date(date);
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = toDateKey(yesterdayDate);

        if (this.lastActivity === yesterday) {
            this.streak += 1;
        } else if (this.lastActivity !== today) {
            this.streak = 1;
        }
        this.lastActivity = today;

        const currentWeekStart = getWeekStartDateKey(date);
        if (this.pointsWeekStart !== currentWeekStart) {
            this.totalPoints = 0;
            this.lessonScores = {};
            this.pointsWeekStart = currentWeekStart;
        }

        const previousScore = this.lessonScores[sessionId] ?? 0;
        this.totalPoints += sessionScore - previousScore;
        this.lessonScores[sessionId] = sessionScore;
    }
}