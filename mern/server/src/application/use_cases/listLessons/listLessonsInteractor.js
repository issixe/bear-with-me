// ListLessonsInteractor.js
// Business logic for the "list lessons" use case.
// 1. Receive the selected module ID.
// 2. Check that the module exists.
// 3. Load the lessons belonging to that module.
// 4. Return each lesson's id, title, startingStage and stages.
// Dependencies 
//  - moduleData: looks up modules
//  - lessonData: looks up lessons
//  - outputBoundary: receives the result

import { ListLessonsInputBoundary } from './listLessonsInputBoundary.js';
import { ListLessonsOutputData } from './listLessonsOutputData.js';

export class ListLessonsInteractor extends ListLessonsInputBoundary {
    constructor({ moduleData, lessonData, outputBoundary }) {
        super();

        this.moduleData = moduleData;
        this.lessonData = lessonData;
        this.outputBoundary = outputBoundary;
    }

    async execute({ moduleId }) {
        if (!moduleId) {
            throw new Error('Module ID is required');
        }

        const module = await this.moduleData.findModuleById(moduleId);

        if (!module) {
            this.outputBoundary.prepareFailView("Module not found");
            return;
        }

        const lessons = await this.lessonData.findLessonsByIds(module.lessonIds);


        const outputData = new ListLessonsOutputData({
            moduleId,
            lessons: lessons.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
            }))
        });

        return this.outputBoundary.prepareSuccessView(outputData);
    }
}