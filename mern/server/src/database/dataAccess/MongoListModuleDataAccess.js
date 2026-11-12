import db from "../connection.js";
import { listModulesDataAccess } from
    "../../application/use_cases/listModules/listModulesDataAccess.js";

export class MongoListModulesDataAccess extends listModulesDataAccess {
    async findAll() {
        const modules = await db.collection("modules")
            .find({})
            .toArray();

        return modules.map((module) => ({
            id: module.module_id,
            title: module.title,
            description: module.description,
            lessonReferences: module.lessons ?? [],
    }));
    }

    async findModuleById(moduleId) {
        const doc = await db.collection("modules").findOne({
            module_id: moduleId,
        });

        if (!doc) return null;

        return {
        id: doc.module_id,
        title: doc.title,
        lessonIds: doc.lessons ?? [],
  };
}
}