import { GetLeaderboardInputData } from "../../application/use_cases/GetLeaderboard/GetLeaderboardInputData.js";

export function createGetLeaderboardController({ GetLeaderboard }) {
    return async function GetLeaderboardController(req) {
        const rawTopCount = req.query.topCount;
        const topCount =
            rawTopCount !== undefined && rawTopCount !== ""
                ? Number(rawTopCount)
                : 5;

        const inputData = new GetLeaderboardInputData({ topCount });
        await GetLeaderboard.execute(inputData);
    };
}
