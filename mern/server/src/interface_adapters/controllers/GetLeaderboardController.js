import { GetLeaderboardInputData } from '../../application/use_cases/GetLeaderboard/GetLeaderboardInputData.js';

export function createGetLeaderboardController({ GetLeaderboard }) {
    return async function GetLeaderboardController(req, res, next) {
        try {
            const rawTopCount = req.query.topCount;
            const topCount =
                rawTopCount !== undefined && rawTopCount !== ''
                    ? Number(rawTopCount)
                    : 5;

            const viewModel = {};
            const presenter = new GetLeaderboardPresenter(viewModel);
            const inputData = new GetLeaderboardInputData({ topCount });

            await GetLeaderboard.execute(inputData, presenter);

            const status = viewModel.httpStatus ?? 200;
            return res.status(status).json(viewModel.body);
        } catch (error) {
            return next(error);
        }
    };
}