export class Module {
    constructor({ moduleId, title, description, lessons }) {
        this.moduleId = moduleId;
        this.title = title;
        this.description = description;
        this.lessons = lessons;
    }

    /** Get all lesson IDs in this module */
    getLessonIds() {
        return [...this.lessons];
    }

    /** Add a lesson to this module */
    addLesson(lessonId) {
        if (!lessonId || typeof lessonId !== "string") {
            throw new Error("Invalid lesson ID");
        }
        if (this.lessons.includes(lessonId)) {
            throw new Error(`Lesson with ID ${lessonId} already exists in module ${this.moduleId}`);
        }
        this.lessons.push(lessonId);
    }

    /** Remove a lesson from this module */
    removeLesson(lessonId) {
        const lessonIndex = this.lessons.indexOf(lessonId);
        if (lessonIndex === -1) {
            throw new Error(`Lesson with ID ${lessonId} not found in module ${this.moduleId}`);
        }
        this.lessons.splice(lessonIndex, 1);
    }
}