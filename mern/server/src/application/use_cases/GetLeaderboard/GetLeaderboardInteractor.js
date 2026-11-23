import { GetLeaderboardInputBoundary } from './GetLeaderboardInputBoundary.js';
import { GetLeaderboardOutputData } from './GetLeaderboardOutputData.js';

export function getMondayOfWeek(dateInput = new Date()) {
    const date = new Date(dateInput);
    date.setHours(0, 0, 0, 0);  // resets time to midnight
    const day = date.getDay();  // returns day of the week as an index from 0 to 6 (0 = Sunday)
    const diffToMonday = day === 0 ? -6 : 1 - day;  // how many days to step back to get to Monday
    date.setDate(date.getDate() + diffToMonday);  // sets date to previous Monday
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
}

export class GetLeaderboardInteractor extends GetLeaderboardInputBoundary {
    constructor({ dataAccess, outputBoundary }) {
        super();
        this.dataAccess = dataAccess;
        this.outputBoundary = outputBoundary;
    }

    async execute({ topCount = 5 } = {}) {
        try{
            const safeTopCount = Math.max(1, Number(topCount) || 5);
            const currentWeekStart = getMondayOfWeek(new Date());

            const agents = await this.dataAccess.getTopUsers({
                weekStart: currentWeekStart,
                topCount: safeTopCount
            });

            const activeThisWeek = agents.filter(
                (agent) => agent.pointsWeekStart === currentWeekStart
            );

            const sortedAgents = [...activeThisWeek].sort(
                (a, b) => (b.totalPoints || 0) - (a.totalPoints || 0)
            );

            /* Return format:
            [
                [agentId, name, totalPoints],
                [agentId, name, totalPoints], and so on
            ]
            */
            const leaderboard = sortedAgents.slice(0, safeTopCount).map((agent) => [
                agent.agentId,
                agent.username || 'Unknown Agent',
                agent.totalPoints || 0
            ]);
            
            const outputData = new GetLeaderboardOutputData({ leaderboard });
            return await this.outputBoundary.prepareSuccessView(outputData);
        } 
        catch(error){
            return await this.outputBoundary.prepareFailView(error?.message || 'Failed to load leaderboard');
        }
    }
}