// Data access interface for listing lessons.
// Implementations must override findModuleById and findLessonsByModuleId.

export class ListLessonsDataAccess {
    async findModuleById(moduleId) {
        throw new Error('findModuleById not implemented');
    }

    async findLessonsByModuleId(moduleId) {
        throw new Error('findLessonsByModuleId not implemented');
    }
}