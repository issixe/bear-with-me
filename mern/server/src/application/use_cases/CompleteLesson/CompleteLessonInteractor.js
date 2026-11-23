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
    constructor({ dataAccess, presenter }) {
        super();
        this.dataAccess = dataAccess;
        this.presenter = presenter;
    }

    async execute ({ agentId, sessionId }) {
        try{
            if (!agentId || !sessionId) {
                throw new Error('agentId and sessionId are required');
            }

            // load session
            const session = await this.dataAccess.findSessionById(sessionId);
            if (!session) {
                throw new Error('session not found');
            }
            if (session.agentId != agentId) {
                throw new Error('session does not belong to this agent');
            }
            const sessionScore = session.cScore;

            // load agent
            const agent = await this.dataAccess.findAgentById(agentId);
            if (!agent) {
                throw new Error('agent not found');
            }

            // update streak and points
            let streak = agent.streak || 0;
            const now = new Date();
            const today = now.toLocaleDateString('en-CA'); // date in YYYY-MM-DD format
            const yesterdayDate = new Date(now);
            yesterdayDate.setDate(yesterdayDate.getDate() - 1); // calendar day subtract 1
            const yesterday = yesterdayDate.toLocaleDateString('en-CA');
            
            if (agent.lastActivity == yesterday) {
                streak += 1;
            }
            else if (agent.lastActivity != today){
                streak = 1;
            }
            agent.streak = streak;

            // reset weekly points every Monday
            // pointsWeekStart is a "YYYY-MM-DD" string storing the Monday date of the week that the user's current totalPoints belongs to
            const currentWeekStart = getMondayOfWeek(now);
            if (agent.pointsWeekStart !== currentWeekStart) {
                agent.totalPoints = 0;
                agent.lessonScores = {};
                agent.pointsWeekStart = currentWeekStart;
            }
            if (!agent.lessonScores) {
                agent.lessonScores = {};
            }

            const prevScore = agent.lessonScores[session.sessionId] ?? 0;
            agent.totalPoints += (session.cScore - prevScore);
            agent.lessonScores[session.sessionId] = session.cScore;
            agent.lastActivity = today;
            session.completed = true;

            await this.dataAccess.updateSession(session);
            await this.dataAccess.updateAgent(agent);

            const outputData = new CompleteLessonOutputData({
                agentId: agent.agentId,
                sessionId: session.sessionId,
                streak: agent.streak,
                sessionScore: session.cScore,
                totalPoints: agent.totalPoints
            });

            return await this.outputBoundary.prepareSuccessView(outputData);
        }
        catch(error){
            return await this.outputBoundary.prepareFailView(error?.message || 'Failed to complete lesson');
        }
    }
}
