import { ListLessonsOutputBoundary } from '../../application/use_cases/ListLessons/ListLessonsOutputBoundary.js';

export class ListLessonsPresenter extends ListLessonsOutputBoundary {
    async present(outputData) {
        return {
            moduleId: outputData.moduleId,
            lessons: outputData.lessons
        };
    }
}