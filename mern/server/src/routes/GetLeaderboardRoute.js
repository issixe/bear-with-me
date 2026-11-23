import express from "express";

import { GetLeaderboardViewModel } from "../interface_adapters/viewModels/GetLeaderboardViewModel.js";
import { GetLeaderboardPresenter } from "../interface_adapters/presenters/GetLeaderboardPresenter.js";
import { GetLeaderboardInteractor } from "../application/use_cases/GetLeaderboard/GetLeaderboardInteractor.js";
import { createGetLeaderboardController } from "../interface_adapters/controllers/GetLeaderboardController.js";

export function createGetLeaderboardRoute({ dataAccess }) {
    const router = express.Router({ mergeParams: true });

    router.get("/", async (req, res, next) => {
        try {
            const viewModel = new GetLeaderboardViewModel();
            const presenter = new GetLeaderboardPresenter(viewModel);
            const interactor = new GetLeaderboardInteractor({
                dataAccess,
                outputBoundary: presenter
            });
            const controller = createGetLeaderboardController({
                GetLeaderboard: interactor
            });

            await controller(req, res, next);

            if (!res.headersSent) {
                return res.status(viewModel.httpStatus).json(viewModel.body);
            }
        } catch (error) {
            return next(error);
        }
    });

    return router;
}