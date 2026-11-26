// Data access interface for listing lessons.

export class ListLessonsDataAccess {
    async findLessonsByIds(_lessonIds) {
        throw new Error("findLessonsByIds not implemented");
    }

    async findLessonsByModuleId(_moduleId) {
        throw new Error("findLessonsByModuleId not implemented");
    }
}
