import { GetLeaderboardInputData } from '../../application/use_cases/GetLeaderboard/GetLeaderboardInputData.js';

export function createGetLeaderboardController({ GetLeaderboard }) {
    return async function GetLeaderboardController(req, res, next) {
        try {
            const rawTopCount = req.query.topCount;
            const topCount =
                rawTopCount !== undefined && rawTopCount !== ''
                    ? Number(rawTopCount)
                    : 5;

            const inputData = new GetLeaderboardInputData({ topCount });
            const responseData = await GetLeaderboard.execute(inputData);

            return res.status(200).json(responseData);
        } catch (error) {
            return next(error);
        }
    };
}