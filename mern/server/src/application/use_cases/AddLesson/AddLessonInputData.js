// AddLessonInputData.js

export class AddLessonInputData {
  constructor({ lessonId, title, startingStage, stages }) {
    this.lessonId = lessonId;
    this.title = title;
    this.startingStage = startingStage;
    this.stages = stages;
  }
}
