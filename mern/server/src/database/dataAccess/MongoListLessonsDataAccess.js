import db from "../connection.js";
import { ListLessonsDataAccess }
  from "../../application/use_cases/listLessons/listLessonsDataAccess.js";

export class MongoListLessonsDataAccess extends ListLessonsDataAccess {
    /**
    * @param {string[]} lessonIds
    */
    async findLessonsByIds(lessonIds) {
    const docs = await db.collection("lessons")
      .find(
        { lesson_id: { $in: lessonIds } },
        { projection: { lesson_id: 1, title: 1 } }
      )
      .toArray();

    const byId = new Map(
      docs.map((doc) => [doc.lesson_id, doc])
    );

    return lessonIds
      .map((id) => byId.get(id))
      .filter(Boolean)
      .map((doc) => ({
        id: doc.lesson_id,
        title: doc.title,
      }));
  }
}