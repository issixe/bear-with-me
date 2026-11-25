export class LessonValidator {
    constructor() {
        this.next = null;
    }

    setNext(next) {
        this.next = next;
        return next; // lets you write a.setNext(b).setNext(c)
    }

    validate(lesson) {
        const error = this.check(lesson);
        if (error) return error; // stop: this handler found a problem
        return this.next ? this.next.validate(lesson) : null; // pass along, or end of chain
    }

    // Subclasses override this. Return an error message string, or null if OK.
    check(_lesson) {
        throw new Error("check not implemented");
    }
}
