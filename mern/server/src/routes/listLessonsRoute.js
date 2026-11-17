import express from "express";

import { listLessonsViewModel } from "../interface_adapters/viewModels/listLessonsViewModel.js";
import { ListLessonsPresenter } from "../interface_adapters/presenters/ListLessonsPresenter.js";
import { ListLessonsInteractor } from "../application/use_cases/listLessons/listLessonsInteractor.js";
import { ListLessonsController } from "../interface_adapters/controllers/ListLessonsController.js";

export function createListLessonsRoute({ dataAccess }) {
    const router = express.Router();

    router.get("/:moduleId/lessons", async (req, res, next) => {
        try {
            // fresh objects per request so responses never get mixed up
            const viewModel = new listLessonsViewModel();
            const presenter = new ListLessonsPresenter(viewModel);
            const interactor = new ListLessonsInteractor({
                dataAccess,
                outputBoundary: presenter
            });
            const controller = new ListLessonsController(interactor);

            await controller.execute(req.params.moduleId);

            res.status(viewModel.httpStatus).json(viewModel.body);
        } catch (error) {
            next(error);
        }
    });

    return router;
}