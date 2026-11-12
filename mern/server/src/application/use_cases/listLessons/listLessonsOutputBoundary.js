// ListLessonsOutputBoundary.js
// Output boundary (interface) for the "list lessons" use case.
// Defines how the interactor sends results out: present(outputData).
// The presenter must extend this class and override present.

export class ListLessonsOutputBoundary {
    prepareSuccessView(outputData) {
        throw new Error("Not Implemented: prepareSuccessView");
    }

    prepareFailView(errorMessage) {
        throw new Error("Not Implemented: prepareFailView");
    }
}
