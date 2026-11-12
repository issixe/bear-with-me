import express from "express";

import { ListLessonsPresenter }
  from "../interface_adapters/presenters/ListLessonsPresenter.js";
import { ListLessonViewModel }
  from "../interface_adapters/viewmodel/listLessonViewModel.js";
import { ListLessonsInteractor }
  from "../application/use_cases/listLessons/listLessonsInteractor.js";
import { ListLessonsController }
  from "../interface_adapters/controllers/ListLessonsController.js";

export function createListLessonsRoute({ moduleData, lessonData }) {
  const router = express.Router({ mergeParams: true });

  router.get("/", async (req, res, next) => {
    try {
      const viewModel = new ListLessonViewModel();
      const presenter = new ListLessonsPresenter(viewModel);

      const interactor = new ListLessonsInteractor({
        moduleData,
        lessonData,
        outputBoundary: presenter,
      });

      const controller = new ListLessonsController(interactor);

      await controller.execute(req.params.moduleId);

      return res.status(viewModel.httpStatus).json(viewModel.body);
    } catch (error) {
      next(error);
    }
  });

  return router;
}