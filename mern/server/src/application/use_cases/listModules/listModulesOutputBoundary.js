// listModulesOutputBoundary.js
// Output boundary (interface) for the "list modules" use case.
// Defines how the interactor sends results out: present(outputData).
// The presenter must extend this class and override present.

<<<<<<< HEAD
export class ListModulesOutputBoundary {
    async present(outputData) {
        throw new Error('Present not implemented');
=======
export class listModulesOutputBoundary {
    prepareSuccessView(outputData) {
        throw new Error("Not implemented");
    }

    prepareFailView(errorMessage) {
        throw new Error("Not implemented");
>>>>>>> 4a22fca (refactor(server): switch list modules/lessons to ca-login pattern and fix seed data mapping)
    }
}