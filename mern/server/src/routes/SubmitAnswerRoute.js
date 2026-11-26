import express from "express";

import { SubmitAnswerInteractor } from "../application/use_cases/SubmitAnswer/SubmitAnswerInteractor.js";
import { SubmitAnswerController } from "../interface_adapters/controllers/SubmitAnswerController.js";
import { SubmitAnswerPresenter } from "../interface_adapters/presenters/SubmitAnswerPresenter.js";
import { SubmitAnswerViewModel } from "../interface_adapters/viewModels/SubmitAnswerViewModel.js";

export function createSubmitAnswerRoute({ dataAccess }) {
    const router = express.Router();

    router.post("/:sessionId/answers", async (req, res, next) => {
        try {
            // Create a separate view model for each request.
            const viewModel = new SubmitAnswerViewModel();
            const presenter = new SubmitAnswerPresenter(viewModel);

            const interactor = new SubmitAnswerInteractor(
                dataAccess,
                presenter,
            );

            const controller = new SubmitAnswerController(interactor);

            // Pass the frontend's input to the controller.
            await controller.execute({
                userId: req.body?.userId,
                sessionId: req.params.sessionId,
                stageId: req.body?.stageId,
                answerId: req.body?.answerId,
                moduleId: req.body?.moduleId,
            });

            // The presenter has populated the view model.
            return res.status(viewModel.httpStatus).json(viewModel.body);
        } catch (error) {
            // Forward unexpected errors to Express's error handler.
            return next(error);
        }
    });

    return router;
}
