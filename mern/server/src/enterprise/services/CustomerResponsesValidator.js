// CustomerResponsesValidator.js
// Check every stage has text for each mood

import { isNonEmptyString, isPlainObject, MOODS } from "./LessonRules.js";
import { LessonValidator } from "./LessonValidator.js";

export class CustomerResponsesValidator extends LessonValidator {
    check(lesson) {
        for (const [stageId, stage] of Object.entries(lesson.stages)) {
            if (!isPlainObject(stage.customerResponses)) {
                return `Stage "${stageId}" is missing customer responses`;
            }
            for (const mood of MOODS) {
                if (!isNonEmptyString(stage.customerResponses[mood])) {
                    return `Stage "${stageId}" is missing the "${mood}" customer response`;
                }
            }
        }
        return null;
    }
}
