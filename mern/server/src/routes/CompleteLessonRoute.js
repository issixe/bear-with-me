import express from "express";

import { CompleteLessonViewModel } from "../interface_adapters/viewModels/CompleteLessonViewModel.js";
import { CompleteLessonPresenter } from "../interface_adapters/presenters/CompleteLessonPresenter.js";
import { CompleteLessonInteractor } from "../application/use_cases/CompleteLesson/CompleteLessonInteractor.js";
import { createCompleteLessonController } from "../interface_adapters/controllers/CompleteLessonController.js";

export function createCompleteLessonRoute({ dataAccess }) {
    const router = express.Router({ mergeParams: true });

    router.post("/:agentId/sessions/:sessionId/complete", async (req, res, next) => {
        try {
            const viewModel = new CompleteLessonViewModel();
            const presenter = new CompleteLessonPresenter(viewModel);
            const interactor = new CompleteLessonInteractor({
                dataAccess,
                outputBoundary: presenter
            });
            const controller = createCompleteLessonController({
                CompleteLesson: interactor
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