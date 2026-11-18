import { ListLessonsInputData } from '../../application/use_cases/ListLessons/ListLessonsInputData.js';

export class ListLessonsController {
    constructor(inputBoundary) {
        this.inputBoundary = inputBoundary;
    }

    execute(moduleId) {
        return this.inputBoundary.execute(new ListLessonsInputData({ moduleId }));
    }
}