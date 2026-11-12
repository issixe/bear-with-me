// ListModulesInteractor.js
// Business logic for the "list modules" use case.
// 1. Load all modules from the module data access.
// 2. Return each module's id, title, description and lessonIds.
//
// Dependencies (injected through the constructor):
//  - moduleData: loads modules
//  - outputBoundary: receives the result

<<<<<<< HEAD
import { ListModulesInputBoundary } from './ListModulesInputBoundary.js';
import { ListModulesOutputData } from './ListModulesOutputData.js';

export class ListModulesInteractor extends ListModulesInputBoundary {
    constructor({ moduleData, outputBoundary }) {
=======
import { listModulesInputBoundary } from './listModulesInputBoundary.js';
import { listModulesOutputData } from './listModulesOutputData.js';
export class ListModulesInteractor extends listModulesInputBoundary {
    constructor({ dataAccess, outputBoundary }) {
>>>>>>> 4a22fca (refactor(server): switch list modules/lessons to ca-login pattern and fix seed data mapping)
        super();

        this.dataAccess = dataAccess;
        this.outputBoundary = outputBoundary;
    }

    async execute() {
        try {
            const modules = await this.dataAccess.findAll();

<<<<<<< HEAD
        const outputData = new ListModulesOutputData({
            modules: modules.map((module) => ({
                id: module.id,
                title: module.title,
                description: module.description,
                lessonIds: module.lessonIds
            }))
        });
=======
            const outputData = new listModulesOutputData({
                modules: modules.map((module) => ({
                    id: module.id,
                    title: module.title,
                    description: module.description,
                    lessonIds: module.lessonIds
                }))
            });
>>>>>>> 4a22fca (refactor(server): switch list modules/lessons to ca-login pattern and fix seed data mapping)

            this.outputBoundary.prepareSuccessView(outputData);
        } catch (error) {
            this.outputBoundary.prepareFailView("Could not load modules.");
        }
    }
}