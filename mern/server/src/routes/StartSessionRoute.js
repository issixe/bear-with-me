import express from "express";
import { StartSessionInteractor } from "../application/use_cases/StartSession/StartSessionInteractor.js";
import { StartSessionController } from "../interface_adapters/controllers/StartSessionController.js";
import { StartSessionPresenter } from "../interface_adapters/presenters/StartSessionPresenter.js";
import { StartSessionViewModel } from "../interface_adapters/viewModels/StartSessionViewModel.js";

export function createStartSessionRoute({ dataAccess }) {
    const router = express.Router();

    router.post("/", async (req, res, next) => {
        try {
            const viewModel = new StartSessionViewModel();
            const presenter = new StartSessionPresenter(viewModel);
            const interactor = new StartSessionInteractor({
                dataAccess,
                presenter,
            });
            const controller = new StartSessionController(interactor);

            await controller.execute(req.body.agentId, req.body.lessonId);

            res.status(viewModel.httpStatus).json(viewModel.body);
        } catch (error) {
            next(error);
        }
    });

    return router;
}
