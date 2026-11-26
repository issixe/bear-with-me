// PipWordsValidator.js
// Checks that pipWords is included and is a string.

import { LessonValidator } from "./LessonValidator.js";

export class PipWordsValidator extends LessonValidator {
    check(lesson) {
        for (const [stageId, stage] of Object.entries(lesson.stages)) {
            if (typeof stage.pipWords !== "string") {
                return `Stage "${stageId}" is missing pipWords (use "" if Pip has nothing to say)`;
            }
        }
        return null;
    }
}
