// ListModulesOutputBoundary.js
// Output boundary (interface) for the "list modules" use case.
// Defines how the interactor sends results out: present(outputData).
// The presenter must extend this class and override present.

export class listModulesOutputBoundary {
    prepareSuccessView(outputData) {
        throw new Error("prepareSuccessView not implemented");
    }

    prepareFailView(errorMessage) {
        throw new Error("prepareFailView not implemented");
    }
}