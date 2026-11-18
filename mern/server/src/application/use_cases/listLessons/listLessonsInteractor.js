// ListLessonsInteractor.js
// Business logic for the "list lessons" use case.
// 1. Receive the selected module ID.
// 2. Check that the module exists.
// 3. Load the lessons belonging to that module.
// 4. Send each lesson's id and title to the output boundary.
// Dependencies
//  - dataAccess: looks up modules and lessons
//  - outputBoundary: receives the result

import { ListLessonsInputBoundary } from './ListLessonsInputBoundary.js';
import { ListLessonsOutputData } from './ListLessonsOutputData.js';

export class ListLessonsInteractor extends ListLessonsInputBoundary {
    constructor({ dataAccess, outputBoundary }) {
        super();

        this.dataAccess = dataAccess;
        this.outputBoundary = outputBoundary;
    }

    async execute({ moduleId }) {
        if (!moduleId) {
            this.outputBoundary.prepareFailView('Module ID is required');
            return;
        }

        const module = await this.dataAccess.findModuleById(moduleId);

        if (!module) {
            this.outputBoundary.prepareFailView(`Module "${moduleId}" not found.`);
            return;
        }

        const lessons = await this.dataAccess.findLessonsByModuleId(moduleId);

        const outputData = new ListLessonsOutputData({
            moduleId,
            lessons: lessons.map((lesson) => ({
                id: lesson.id,
                title: lesson.title
            }))
        });

        this.outputBoundary.prepareSuccessView(outputData);
    }
}