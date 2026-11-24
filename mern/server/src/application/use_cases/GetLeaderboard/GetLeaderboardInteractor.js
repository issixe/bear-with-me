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

            const user = await this.dataAccess.getTopUsers({
                weekStart: currentWeekStart,
                topCount: safeTopCount
            });

            const activeThisWeek = user.filter(
                (user) => user.pointsWeekStart === currentWeekStart
            );

            const sortedUsers = [...activeThisWeek].sort(
                (a, b) => (b.totalPoints || 0) - (a.totalPoints || 0)
            );

            /* Return format:
            [
                [userId, name, totalPoints],
                [userId, name, totalPoints], and so on
            ]
            */
            const leaderboard = sortedUsers.slice(0, safeTopCount).map((user) => [
                user.userId,
                user.username || 'Unknown User',
                user.totalPoints || 0
            ]);
            
            const outputData = new GetLeaderboardOutputData({ leaderboard });
            return await this.outputBoundary.prepareSuccessView(outputData);
        } 
        catch(error){
            return await this.outputBoundary.prepareFailView(error?.message || 'Failed to load leaderboard');
        }
    }
}