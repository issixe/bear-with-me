// Data access interface for listing lessons.
// Implementations must override findById and findByModuleId.

export class listLessonsDataAccess {
    async findById(moduleId) {
        throw new Error('findById not implemented');
    }

    async findByModuleId(moduleId) {
        throw new Error('findByModuleId not implemented');
    }
}