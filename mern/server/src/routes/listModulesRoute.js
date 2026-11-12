import express from "express";

import { ListModulesInteractor }
  from "../application/use_cases/listModules/ListModulesInteractor.js";
import { ListModulesController }
  from "../interface_adapters/controllers/listModulesController.js";
import { listModulesPresenter }
  from "../interface_adapters/presenters/listModulesPresenter.js";
import { ListModulesViewModel }
  from "../interface_adapters/viewmodel/listModulesViewModel.js";

export function createListModulesRoute({ moduleData }) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const viewModel = new ListModulesViewModel();
      const presenter = new listModulesPresenter(viewModel);

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