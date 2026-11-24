import express from "express";
import { ListModulesInteractor } from "../application/use_cases/ListModules/ListModulesInteractor.js";
import { ListModulesController } from "../interface_adapters/controllers/ListModulesController.js";
import { ListModulesPresenter } from "../interface_adapters/presenters/ListModulesPresenter.js";
import { ListModulesViewModel } from "../interface_adapters/viewModels/ListModulesViewModel.js";

export function createListModulesRoute({ dataAccess }) {
    const router = express.Router();

    router.get("/", async (_req, res, next) => {
        try {
            const viewModel = new ListModulesViewModel();
            const presenter = new ListModulesPresenter(viewModel);
            const interactor = new ListModulesInteractor({
                dataAccess,
                outputBoundary: presenter,
            });
            const controller = new ListModulesController(interactor);

            await controller.execute();

            res.status(viewModel.httpStatus).json(viewModel.body);
        } catch (error) {
            next(error);
        }
    });

    router.get("/", async (_req, res, next) => {
        try {
            const viewModel = new ListModulesViewModel();
            const presenter = new ListModulesPresenter(viewModel);

            const interactor = new ListModulesInteractor({
                moduleData,
                outputBoundary: presenter,
            });

            const controller = new ListModulesController(interactor);

            await controller.execute();

            return res.status(viewModel.httpStatus).json(viewModel.body);
        } catch (error) {
            next(error);
        }
    });

    return router;
}
