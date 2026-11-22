export class SubmitAnswerOutputBoundary {
  prepareSuccessView(outputData) {
    throw new Error("prepareSuccessView not implemented");
  }

  prepareFailView(errorMessage, errorCode) {
    throw new Error("prepareFailView not implemented");
  }
}