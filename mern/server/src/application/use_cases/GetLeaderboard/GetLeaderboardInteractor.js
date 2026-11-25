import { GetLeaderboardInputBoundary } from './GetLeaderboardInputBoundary.js';
import { GetLeaderboardOutputData } from './GetLeaderboardOutputData.js';
import { getWeekStartDateKey } from '../../../enterprise/entities/User.js';

export class GetLeaderboardInteractor extends GetLeaderboardInputBoundary {
    constructor({ dataAccess, outputBoundary }) {
        super();
        this.dataAccess = dataAccess;
        this.outputBoundary = outputBoundary;
    }

    async execute({ topCount = 5 } = {}) {
        try{
            const safeTopCount = Math.max(1, Number(topCount) || 5);
            const currentWeekStart = getWeekStartDateKey();

            const user = await this.dataAccess.getTopUsers({
                weekStart: currentWeekStart,
                topCount: safeTopCount
            });

            const activeThisWeek = user.filter(
                (user) =>
                    user.pointsWeekStart === currentWeekStart &&
                    Number(user.totalPoints) > 0
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