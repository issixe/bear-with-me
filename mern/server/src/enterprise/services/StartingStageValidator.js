import { LessonValidator } from "./LessonValidator.js";

export class StartingStageValidator extends LessonValidator {
    check(lesson) {
        if (!Object.hasOwn(lesson.stages, lesson.startingStage)) {
            return `starting_stage "${lesson.startingStage}" is not one of the stages`;
        }
        return null;
    }
}
