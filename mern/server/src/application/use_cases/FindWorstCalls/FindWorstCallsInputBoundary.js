//FindWorstCallsInputBoundary.js
// Input boundary (interface) for the "find worst calls" use case.
// Defines how the controller sends input data to the interactor: execute(inputData).
// The interactor must extend this class and override execute.
export class FindWorstCallsInputBoundary {
    async execute(_inputData) {
        throw new Error("execute not implemented");
    }
}
