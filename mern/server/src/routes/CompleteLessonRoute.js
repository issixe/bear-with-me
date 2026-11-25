import express from "express";
import { CompleteLessonInteractor } from "../application/use_cases/CompleteLesson/CompleteLessonInteractor.js";
import { createCompleteLessonController } from "../interface_adapters/controllers/CompleteLessonController.js";
import { CompleteLessonPresenter } from "../interface_adapters/presenters/CompleteLessonPresenter.js";

export function createCompleteLessonRoute({ dataAccess }) {
    const router = express.Router();

    router.post("/:sessionId/complete", async (req, res, next) => {
        const presenter = new CompleteLessonPresenter();
        const interactor = new CompleteLessonInteractor({
            dataAccess,
            presenter,
        });
        const controller = createCompleteLessonController({
            CompleteLesson: interactor,
        });

        return controller(req, res, next);
    });

    return router;
}
