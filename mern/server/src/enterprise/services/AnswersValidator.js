// AnswersValidator.js
// Check each stage has choices and scores

import { LessonValidator } from "./LessonValidator.js";
import {
  SCORE_CRITERIA,
  isNonEmptyString,
  isPlainObject,
} from "./LessonRules.js";

const MIN_ANSWERS = 3;

export class AnswersValidator extends LessonValidator {
  check(lesson) {
    for (const [stageId, stage] of Object.entries(lesson.stages)) {
      if (
        !isPlainObject(stage.answers) ||
        Object.keys(stage.answers).length < MIN_ANSWERS
      ) {
        return `Stage "${stageId}" needs at least ${MIN_ANSWERS} answers`;
      }

      for (const [answerId, answer] of Object.entries(stage.answers)) {
        const where = `Stage "${stageId}", answer "${answerId}"`;

        if (!isPlainObject(answer)) return `${where} must be an object`;
        if (!isNonEmptyString(answer.text)) return `${where} is missing text`;
        if (!isPlainObject(answer.scores)) return `${where} is missing scores`;

        for (const criterion of SCORE_CRITERIA) {
          const score = answer.scores[criterion];
          if (!Number.isFinite(score) || score < 0 || score > 100) {
            return `${where}: "${criterion}" score must be a number from 0 to 100`;
          }
        }
      }
    }
    return null;
  }
}
