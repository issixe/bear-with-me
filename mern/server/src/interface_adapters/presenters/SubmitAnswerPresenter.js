import { SubmitAnswerOutputBoundary } from "../../application/use_cases/SubmitAnswer/SubmitAnswerOutputBoundary.js";


export class SubmitAnswerPresenter extends SubmitAnswerOutputBoundary {
  constructor(viewModel) {
    super();
    this.viewModel = viewModel;
  }

  prepareSuccessView(out) {
    this.viewModel.httpStatus = 200;

    this.viewModel.body = {
      sessionId: out.sessionId,
      cScore: out.cScore,
      earnedScore: out.earnedScore,
      status: out.status,
      isFinished: out.isFinished,
      stageId: out.stageId,
      customerMood: out.customerMood,
      customerResponse: out.customerResponse,
      answerOptions: out.answerOptions.map((answer) => ({
        answerId: answer.answerId,
        text: answer.text,
      })),
      pipWords: out.pipWords,
    };
  }

  prepareFailView(message, code = "INVALID_INPUT") {
    const statusByCode = {
      INVALID_INPUT: 400,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      CONFLICT: 409,
    };

    this.viewModel.httpStatus = statusByCode[code] ?? 500;
    this.viewModel.body = {
      error: message,
    };
  }
}