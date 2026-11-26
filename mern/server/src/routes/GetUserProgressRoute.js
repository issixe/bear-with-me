import express from "express";
import { GetUserProgressInteractor } from "../application/use_cases/GetUserProgress/GetUserProgressInteractor.js";
import { GetUserProgressController } from "../interface_adapters/controllers/GetUserProgressController.js";
import { GetUserProgressPresenter } from "../interface_adapters/presenters/GetUserProgressPresenter.js";
import { GetUserProgressViewModel } from "../interface_adapters/viewModels/GetUserProgressViewModel.js";

export function createGetUserProgressRoute({ dataAccess }) {
    const router = express.Router();

    router.get("/:agentId", async (req, res, next) => {
        try {
            const viewModel = new GetUserProgressViewModel();
            const presenter = new GetUserProgressPresenter(viewModel);
            const interactor = new GetUserProgressInteractor({
                dataAccess,
                outputBoundary: presenter,
            });
            const controller = new GetUserProgressController(interactor);

            await controller.execute(req.params.agentId);

            return res.status(viewModel.httpStatus).json(viewModel.body);
        } catch (error) {
            return next(error);
        }
    });

    return router;
}
