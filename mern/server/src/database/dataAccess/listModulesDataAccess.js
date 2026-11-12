import db from "../connection.js";
import { listModulesDataAccess } from
    "../../application/use_cases/listModules/listModulesDataAccess.js";

export class MongoListModulesDataAccess extends listModulesDataAccess {
    async findAll() {
        const modules = await db.collection("modules")
            .find({})
            .toArray();

        return modules.map((module) => ({
            id: module._id.toString(),
            title: module.title,
            description: module.description,
            lessonReferences: module.lessonReferences
        }));
    }
}