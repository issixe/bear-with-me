// ListLessonsOutputBoundary.js
// Output boundary (interface) for the "list lessons" use case.
// Defines how the interactor sends results out: present(outputData).
// The presenter must extend this class and override present.

export class listLessonsOutputBoundary {
    prepareSuccessView(outputData) {
        throw new Error("Not implemented");
    }

    prepareFailView(errorMessage) {
        throw new Error("Not implemented");
    }
}