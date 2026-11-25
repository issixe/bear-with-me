import { GetLeaderboardOutputBoundary } from "../../application/use_cases/GetLeaderboard/GetLeaderboardOutputBoundary.js";

export class GetLeaderboardPresenter extends GetLeaderboardOutputBoundary {
    constructor(viewModel) {
        super();
        this.viewModel = viewModel;
    }

    prepareSuccessView(out) {
        this.viewModel.httpStatus = 200;
        this.viewModel.body = { leaderboard: out.leaderboard };
    }

    prepareFailView(msg) {
        this.viewModel.httpStatus = 500;
        this.viewModel.body = { error: msg };
    }
}
