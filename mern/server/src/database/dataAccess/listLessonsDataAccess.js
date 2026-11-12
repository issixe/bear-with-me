import db from "../connection.js";
import { listLessonsDataAccess } from
    "../../application/use_cases/listLessons/listLessonsDataAccess.js";

export class MongoListLessonsDataAccess extends listLessonsDataAccess {
    async findModuleById(moduleId) {
        const m = await db.collection("modules").findOne({ module_id: moduleId });
        return m ? { id: m.module_id, title: m.title, lessonIds: m.lessons ?? [] } : null;
    }

    async findLessonsByModuleId(moduleId) {
        const m = await this.findModuleById(moduleId);
        if (!m) return [];

        const docs = await db.collection("lessons")
            .find(
                { lesson_id: { $in: m.lessonIds } },
                { projection: { lesson_id: 1, title: 1 } }
            )
            .toArray();

        const byId = new Map(docs.map(d => [d.lesson_id, d]));

        return m.lessonIds
            .map(id => byId.get(id))
            .filter(Boolean)
            .map(d => ({ id: d.lesson_id, title: d.title }));
    }
}