import express from "express";

import { SubmitAnswerInteractor } from "../application/use_cases/SubmitAnswer/SubmitAnswerInteractor.js";
import { SubmitAnswerController } from "../interface_adapters/controllers/SubmitAnswerController.js";
import { SubmitAnswerPresenter } from "../interface_adapters/presenters/SubmitAnswerPresenter.js";

export function createSubmitAnswerRoute({ dataAccess }) {
  const router = express.Router();

  const presenter = new SubmitAnswerPresenter();
  const interactor = new SubmitAnswerInteractor(dataAccess, presenter);
  const controller = new SubmitAnswerController(interactor);

  router.post("/:sessionId/answers", async (req, res, next) => {
    try {
      const responseData = await controller.execute({
        userId: req.body?.userId,
        sessionId: req.params.sessionId,
        stageId: req.body?.stageId,
        answerId: req.body?.answerId,
        moduleId: req.body?.moduleId,
      });

      return res.status(200).json(responseData);
    } catch (error) {
      return next(error);
    }
  });

  return router;
}