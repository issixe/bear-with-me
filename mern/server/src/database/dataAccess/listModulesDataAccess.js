import db from "../connection.js";
import { ListModulesDataAccess } from
    "../../application/use_cases/ListModules/ListModulesDataAccess.js";

export class MongoListModulesDataAccess extends ListModulesDataAccess {
    async findAll() {
        const modules = await db.collection("modules")
            .find({})
            .toArray();

        return modules.map((module) => ({
            id: module.module_id,
            title: module.title,
            description: module.description,
            lessonIds: module.lessons ?? []
        }));
    }
}