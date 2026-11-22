// FindWorstCallsOutputBoundary.js
// Output boundary (interface) for the "find worst calls" use case.
// Defines how the interactor sends output data to the view.
// The view must extend this class and override the methods.
export class FindWorstCallsOutputBoundary {
  prepareSuccessView(outputData) {
    throw new Error("prepareSuccessView not implemented");
  }

  prepareFailView(errorMessage) {
    throw new Error("prepareFailView not implemented");
  }
}