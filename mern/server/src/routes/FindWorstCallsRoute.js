import express from "express";
import { FindWorstCallsInteractor } from "../application/use_cases/FindWorstCalls/FindWorstCallsInteractor.js";
import { FindWorstCallsController } from "../interface_adapters/controllers/FindWorstCallsController.js";
import { FindWorstCallsPresenter } from "../interface_adapters/presenters/FindWorstCallsPresenter.js";
import { FindWorstCallsViewModel } from "../interface_adapters/viewModels/FindWorstCallsViewModel.js";

export function createFindWorstCallsRoute() {
    const router = express.Router();
    router.post("/worst-calls", async (req, res, next) => {
        const viewModel = new FindWorstCallsViewModel();
        const presenter = new FindWorstCallsPresenter(viewModel);
        const interactor = new FindWorstCallsInteractor({
            outputBoundary: presenter,
        });
        const controller = new FindWorstCallsController(interactor);

        try {
            await controller.execute(req.body);
            return res.status(viewModel.httpStatus).json(viewModel.body);
        } catch (error) {
            return next(error);
        }
    });

    return router;
}
