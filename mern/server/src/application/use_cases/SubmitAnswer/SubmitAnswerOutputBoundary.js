export class SubmitAnswerOutputBoundary {
    prepareSuccessView(_outputData) {
        throw new Error("prepareSuccessView not implemented");
    }

    prepareFailView(_errorMessage, _errorCode) {
        throw new Error("prepareFailView not implemented");
    }
}
