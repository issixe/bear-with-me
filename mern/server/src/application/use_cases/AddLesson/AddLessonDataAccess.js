// Data access interface for adding a lesson.

export class AddLessonDataAccess {
  async lessonExists(lessonId) {
    throw new Error("lessonExists not implemented");
  }

  async saveLesson(lesson) {
    throw new Error("saveLesson not implemented");
  }

  async addLessonToModule(module, lessonId) {
    throw new Error("addLessonToModule not implemented");
  }
}
