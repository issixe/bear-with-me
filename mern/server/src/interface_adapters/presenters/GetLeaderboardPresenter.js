import { GetLeaderboardOutputBoundary } from '../../application/use_cases/GetLeaderboard/GetLeaderboardOutputBoundary.js';

export class GetLeaderboardPresenter extends GetLeaderboardOutputBoundary {
    async present(outputData) {
        return {
            leaderboard: outputData.leaderboard
        };
    }
}