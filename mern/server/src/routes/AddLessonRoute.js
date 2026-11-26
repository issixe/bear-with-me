import express from "express";
import { AddLessonInteractor } from "../application/use_cases/AddLesson/AddLessonInteractor.js";
import { createLessonValidationChain } from "../enterprise/services/CreateLessonValidationChain.js";
import { AddLessonController } from "../interface_adapters/controllers/AddLessonController.js";
import { AddLessonPresenter } from "../interface_adapters/presenters/AddLessonPresenter.js";
import { AddLessonViewModel } from "../interface_adapters/viewModels/AddLessonViewModel.js";

export function createAddLessonRoute({ dataAccess }) {
    const router = express.Router();

    router.post("/", async (req, res, next) => {
        try {
            const viewModel = new AddLessonViewModel();
            const presenter = new AddLessonPresenter(viewModel);
            const interactor = new AddLessonInteractor({
                dataAccess,
                presenter,
                validator: createLessonValidationChain(),
            });
            const controller = new AddLessonController(interactor);

            await controller.execute(req.body);

            res.status(viewModel.httpStatus).json(viewModel.body);
        } catch (error) {
            next(error);
        }
    });

    return router;
}
