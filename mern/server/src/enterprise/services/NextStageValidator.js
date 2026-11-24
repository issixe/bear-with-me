// NextStageValidator.js
// Check that nextStage path is valid

import { LessonValidator } from "./LessonValidator.js";

export class NextStageValidator extends LessonValidator {
  check(lesson) {
    const stageIds = Object.keys(lesson.stages);

    // Every nextStage must be null or point to a real stage
    for (const [stageId, stage] of Object.entries(lesson.stages)) {
      const next = stage.nextStage;
      if (next !== null && !stageIds.includes(next)) {
        return `Stage "${stageId}" has nextStage "${next}", which is not a stage (use null to end the lesson)`;
      }
    }

    // Following the stages from the start must reach an end without looping
    const visited = new Set();
    let current = lesson.startingStage;
    while (current !== null) {
      if (visited.has(current)) {
        return `Stages loop back to "${current}", so the lesson never ends`;
      }
      visited.add(current);
      current = lesson.stages[current].nextStage;
    }

    // Every stage should be reachable from the start
    const unreachable = stageIds.filter((id) => !visited.has(id));
    if (unreachable.length > 0) {
      return `These stages can't be reached from the starting stage: ${unreachable.join(", ")}`;
    }

    return null;
  }
}
