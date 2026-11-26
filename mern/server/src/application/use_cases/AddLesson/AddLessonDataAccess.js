// Data access interface for adding a lesson.

export class AddLessonDataAccess {
    async lessonExists(_lessonId) {
        throw new Error("lessonExists not implemented");
    }

    async saveLesson(_lesson) {
        throw new Error("saveLesson not implemented");
    }

    async addLessonToModule(_module, _lessonId) {
        throw new Error("addLessonToModule not implemented");
    }
}
