import db from "../connection.js";
import { ListModulesDataAccess } from
    "../../application/use_cases/ListModules/ListModulesDataAccess.js";

export class MongoListModulesDataAccess extends ListModulesDataAccess {
    async findAll() {
        const modules = await db.collection("modules")
            .find({})
            .toArray();

        return modules.map((m) => ({
            id: m.module_id,
            title: m.title,
            description: m.description,
            lessonIds: m.lessons ?? []
        }));
    }
}