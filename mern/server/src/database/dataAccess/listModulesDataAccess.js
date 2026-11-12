import db from "../connection.js";
import { ListModulesDataAccess } from
    "../../application/use_cases/ListModules/ListModulesDataAccess.js";

export class MongoListModulesDataAccess extends ListModulesDataAccess {
    async findAll() {
        const modules = await db.collection("modules")
            .find({})
            .toArray();

<<<<<<< HEAD
        return modules.map((m) => ({
            id: m.module_id,
            title: m.title,
            description: m.description,
            lessonIds: m.lessons ?? []
=======
        return modules.map((module) => ({
            id: module.module_id,
            title: module.title,
            description: module.description,
            lessonIds: module.lessons ?? []
>>>>>>> 4a22fca (refactor(server): switch list modules/lessons to ca-login pattern and fix seed data mapping)
        }));
    }
}