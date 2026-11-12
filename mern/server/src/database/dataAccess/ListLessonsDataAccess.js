import { ObjectId } from "mongodb";
import db from '../connection.js';
import { ListLessonsDataAccess } from '../../application/use_cases/ListLessons/ListLessonsDataAccess.js';

export class MongoListLessonsDataAccess extends ListLessonsDataAccess {
  async findModuleById(moduleId) {
    if (!ObjectId.isValid(moduleId)) return null;
    const module = await db.collection("modules").findOne({ moduleId: moduleId });
    if (!module) return null;
    return module ? { 
        id: module._id.toString(),
        title: module.title,
        lessonIds: (m.lessonReferences ?? []).map(String)
    } : null;
  }

  async findLessonsByModuleId(moduleId) {
    const module = await this.findModuleById(moduleId);
    if (!module) return [];
    const docs = await db.collection("lessons")
      .find(
        { lesson_id: { $in: module.lessonIds } },
        { projection: { title: 1 } }
    )
      .toArray();
    const byId = new Map(docs.map((d) => [d._id.toString(), d]));
    return m.lessonIds
      .map((id) => byId.get(id))
      .filter(Boolean)
      .map((d) => ({ id: d._id.toString(), title: d.title }));
  }
}