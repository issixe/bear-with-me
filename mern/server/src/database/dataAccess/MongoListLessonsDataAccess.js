import db from "../connection.js";
import { ListLessonsDataAccess } from "../../application/use_cases/ListLessons/ListLessonsDataAccess.js";

export class MongoListLessonsDataAccess extends ListLessonsDataAccess {
    async findModuleById(moduleId) {
        const module = await db
            .collection("modules")
            .findOne({ module_id: moduleId });
        return module
            ? {
                  id: module.module_id,
                  title: module.title,
                  lessonIds: module.lessons ?? [],
              }
            : null;
    }

    async findLessonsByModuleId(moduleId) {
        const module = await this.findModuleById(moduleId);
        return module ? this.findLessonsByIds(module.lessonIds) : [];
    }

    /**
     * @param {string[]} lessonIds
     */
    async findLessonsByIds(lessonIds) {
        const docs = await db
            .collection("lessons")
            .find(
                { lesson_id: { $in: lessonIds } },
                { projection: { lesson_id: 1, title: 1 } },
            )
            .toArray();

        const byId = new Map(docs.map((doc) => [doc.lesson_id, doc]));

        return lessonIds
            .map((id) => byId.get(id))
            .filter(Boolean)
            .map((doc) => ({
                id: doc.lesson_id,
                title: doc.title,
            }));
    }
}
