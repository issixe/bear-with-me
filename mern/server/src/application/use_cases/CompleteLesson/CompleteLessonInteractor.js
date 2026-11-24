import { CompleteLessonInputBoundary } from "./CompleteLessonInputBoundary.js";
import { CompleteLessonOutputData } from "./CompleteLessonOutputData.js";

export function getMondayOfWeek(dateInput = new Date()) {
    const date = new Date(dateInput);
    date.setHours(0, 0, 0, 0);  // resets time to midnight
    const day = date.getDay();  // returns day of the week as an index from 0 to 6 (0 = Sunday)
    const diffToMonday = day === 0 ? -6 : 1 - day;  // how many days to step back to get to Monday
    date.setDate(date.getDate() + diffToMonday);  // sets date to previous Monday
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
}

export class CompleteLessonInteractor extends CompleteLessonInputBoundary {
    constructor({ dataAccess, outputBoundary }){
        super();
        this.dataAccess = dataAccess;
        this.outputBoundary = outputBoundary;
    }

    async execute ({ userId, sessionId }) {
        try{
            if (!userId || !sessionId) {
                throw new Error('userId and sessionId are required');
            }

            // load session
            const session = await this.dataAccess.findSessionById(sessionId);
            if (!session) {
                throw new Error('session not found');
            }
            if (session.userId != userId) {
                throw new Error('session does not belong to this user');
            }
            const sessionScore = session.cScore;

            // load user
            const user = await this.dataAccess.findUserById(userId);
            if (!user) {
                throw new Error('user not found');
            }

            // update streak and points
            let streak = user.streak || 0;
            const now = new Date();
            const today = now.toLocaleDateString('en-CA'); // date in YYYY-MM-DD format
            const yesterdayDate = new Date(now);
            yesterdayDate.setDate(yesterdayDate.getDate() - 1); // calendar day subtract 1
            const yesterday = yesterdayDate.toLocaleDateString('en-CA');
            
            if (user.lastActivity == yesterday) {
                streak += 1;
            }
            else if (user.lastActivity != today){
                streak = 1;
            }
            user.streak = streak;

            // reset weekly points every Monday
            // pointsWeekStart is a "YYYY-MM-DD" string storing the Monday date of the week that the user's current totalPoints belongs to
            const currentWeekStart = getMondayOfWeek(now);
            if (user.pointsWeekStart !== currentWeekStart) {
                user.totalPoints = 0;
                user.lessonScores = {};
                user.pointsWeekStart = currentWeekStart;
            }
            if (!user.lessonScores) {
                user.lessonScores = {};
            }

            const prevScore = user.lessonScores[session.sessionId] ?? 0;
            user.totalPoints += (session.cScore - prevScore);
            user.lessonScores[session.sessionId] = session.cScore;
            user.lastActivity = today;
            session.completed = true;

            await this.dataAccess.updateSession(session);
            await this.dataAccess.updateUser(user);

            const outputData = new CompleteLessonOutputData({
                userId: user.userId,
                sessionId: session.sessionId,
                streak: user.streak,
                sessionScore: session.cScore,
                totalPoints: user.totalPoints
            });

            return await this.outputBoundary.prepareSuccessView(outputData);
        }
        catch(error){
            return await this.outputBoundary.prepareFailView(error?.message || 'Failed to complete lesson');
        }
    }
}
