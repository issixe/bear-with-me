import express from "express";
import { createLessonValidationChain } from "../enterprise/services/CreateLessonValidationChain.js";
import { AddLessonViewModel } from "../interface_adapters/viewModels/AddLessonViewModel.js";
import { AddLessonPresenter } from "../interface_adapters/presenters/AddLessonPresenter.js";
import { AddLessonInteractor } from "../application/use_cases/AddLesson/AddLessonInteractor.js";
import { AddLessonController } from "../interface_adapters/controllers/AddLessonController.js";

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
