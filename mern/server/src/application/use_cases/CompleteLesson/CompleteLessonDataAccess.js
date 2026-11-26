// need to get the id and actual item to write

export class CompleteLessonDataAccess {
    async findSessionById(_sessionId) {
        throw new Error("findSessionById not implemented");
    }

    async findOrCreateUser(_userId, _username) {
        throw new Error("findOrCreateUser not implemented");
    }

    async updateSession(_session) {
        throw new Error("updateSession not implemented");
    }

    async updateUser(user) {
        throw new Error("updateUser not implemented");
    }
}
