import { ListLessonsInputData } from '../../application/use_cases/listLessons/listLessonsInputData.js';


export class ListLessonsController {
  constructor(inputBoundary) {
    this.inputBoundary = inputBoundary;
  }

  execute(moduleId) {
    const inputData = new ListLessonsInputData({ moduleId });
    return this.inputBoundary.execute(inputData);
  }
}