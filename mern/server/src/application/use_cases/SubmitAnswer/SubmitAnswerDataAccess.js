// Data access interface for the "Submit Answer" use case.
// Defines what the interactor needs from the data layer:findSessionById, saveSession, findLessonById, findModuleById

export class SubmitAnswerDataAccess {
    async findSessionById() {
        throw new Error("findSessionById not implemented");
    }

    async findModuleById(_moduleId) {
        throw new Error("findModuleById not implemented");
    }

    async findLessonById(_lessonId) {
        throw new Error("findLessonById not implemented");
    }

    async saveSession(_session) {
        throw new Error("saveSession not implemented");
    }
}
