// RequiredFieldsValidator.js
// Check that fields all exist and have the right types

import { isNonEmptyString, isPlainObject } from "./LessonRules.js";
import { LessonValidator } from "./LessonValidator.js";

export class RequiredFieldsValidator extends LessonValidator {
    check(lesson) {
        if (!isPlainObject(lesson)) return "Lesson must be a JSON object";

        for (const field of ["lessonId", "title", "startingStage"]) {
            if (!isNonEmptyString(lesson[field])) return `${field} is required`;
        }

        if (!/^[a-z0-9_]+$/.test(lesson.lessonId)) {
            return "lessonId may only contain lowercase letters, numbers and underscores";
        }

        if (
            !isPlainObject(lesson.stages) ||
            Object.keys(lesson.stages).length === 0
        ) {
            return "stages must be an object with at least one stage";
        }

        for (const [stageId, stage] of Object.entries(lesson.stages)) {
            if (!isPlainObject(stage))
                return `Stage "${stageId}" must be an object`;
        }

        return null;
    }
}
