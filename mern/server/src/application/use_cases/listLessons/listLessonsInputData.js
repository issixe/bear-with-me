// ListLessonsInputData.js
// Input data for the "list lessons" use case.
// A container holding what the request needs: the moduleId.

export class ListLessonsInputData {
    constructor({ moduleId }) {
        this.moduleId = moduleId;
    }
}