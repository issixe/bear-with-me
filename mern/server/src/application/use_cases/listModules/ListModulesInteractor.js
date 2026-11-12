// ListModulesInteractor.js
// Business logic for the "list modules" use case.
// 1. Load all modules from the module data access.
// 2. Return each module's id, title, description and lessonIds.
//
// Dependencies (injected through the constructor):
//  - moduleData: loads modules
//  - outputBoundary: receives the result

import { ListModulesInputBoundary } from './ListModulesInputBoundary.js';
import { ListModulesOutputData } from './ListModulesOutputData.js';

export class ListModulesInteractor extends ListModulesInputBoundary {
    constructor({ moduleData, outputBoundary }) {
        super();

        this.moduleData = moduleData;
        this.outputBoundary = outputBoundary;
    }

    async execute() {
        const modules = await this.moduleData.findAll();

        const outputData = new ListModulesOutputData({
            modules: modules.map((module) => ({
                id: module.id,
                title: module.title,
                description: module.description,
                lessonIds: module.lessonIds
            }))
        });

        return this.outputBoundary.present(outputData);
    }
}