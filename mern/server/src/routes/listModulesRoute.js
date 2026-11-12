import express from "express";

import { listModulesViewModel } from "../interface_adapters/viewModels/listModulesViewModel.js";
import { listModulesPresenter } from "../interface_adapters/presenters/listModulesPresenter.js";
import { ListModulesInteractor } from "../application/use_cases/listModules/ListModulesInteractor.js";
import { ListModulesController } from "../interface_adapters/controllers/listModulesController.js";

export function createListModulesRoute({ dataAccess }) {
    const router = express.Router();

    router.get("/", async (req, res, next) => {
        try {
            const viewModel = new listModulesViewModel();
            const presenter = new listModulesPresenter(viewModel);
            const interactor = new ListModulesInteractor({
                dataAccess,
                outputBoundary: presenter
            });
            const controller = new ListModulesController(interactor);

            await controller.execute();

            res.status(viewModel.httpStatus).json(viewModel.body);
        } catch (error) {
            next(error);
        }
    });

    return router;
}