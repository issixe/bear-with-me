// AddLessonInteractor.js
// 1. Validate the uploaded lesson by running it through the validation chain.
// 2. Reject it if a lesson with the same id already exists.
// 3. Save the lesson and add it to the Custom Lessons module.
// 4. Report the new lesson id.

import { AddLessonInputBoundary } from "./AddLessonInputBoundary.js";
import { AddLessonOutputData } from "./AddLessonOutputData.js";
import { Lesson } from "../../../enterprise/entities/lesson.js";
import { createLessonValidationChain } from "../../../enterprise/validation/CreateLessonValidationChain.js";

const CUSTOM_MODULE = {
  moduleId: "custom_lessons",
  title: "Custom Lessons",
  description: "Lessons created by your team.",
};

export class AddLessonInteractor extends AddLessonInputBoundary {
  constructor({ dataAccess, presenter, validator }) {
    super();
    this.dataAccess = dataAccess;
    this.presenter = presenter;
    this.validator = validator;
  }

  async execute(inputData) {
    // 1. Start the validation using the Chain of Responsibility design pattern
    const error = this.validator.validate(inputData);
    if (error) {
      return this.presenter.prepareFailView({
        reason: "invalid",
        message: error,
      });
    }

    // 2. Check for duplicate lessonId in database. Exists outside of the validator because this requires database access
    if (await this.dataAccess.lessonExists(inputData.lessonId)) {
      return this.presenter.prepareFailView({
        reason: "duplicate",
        message: `A lesson with id "${inputData.lessonId}" already exists`,
      });
    }

    // 3. Build the entity now that it has been validated
    const lesson = new Lesson({
      lessonId: inputData.lessonId,
      title: inputData.title,
      moduleId: CUSTOM_MODULE.moduleId,
      startingStage: inputData.startingStage,
      stages: inputData.stages,
    });

    await this.dataAccess.saveLesson(lesson);
    await this.dataAccess.addLessonToModule(CUSTOM_MODULE, lesson.lessonId);

    return this.presenter.prepareSuccessView(
      new AddLessonOutputData({
        lessonId: lesson.lessonId,
        moduleId: CUSTOM_MODULE.moduleId,
      }),
    );
  }
}
