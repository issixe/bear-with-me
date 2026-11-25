import { AddLessonDataAccess } from "../../application/use_cases/AddLesson/AddLessonDataAccess.js";
import db from "../connection.js";

export class MongoAddLessonDataAccess extends AddLessonDataAccess {
    async lessonExists(lessonId) {
        const count = await db
            .collection("lessons")
            .countDocuments({ lesson_id: lessonId }, { limit: 1 });
        return count > 0;
    }

    async saveLesson(lesson) {
        await db.collection("lessons").insertOne({
            lesson_id: lesson.lessonId,
            title: lesson.title,
            module: lesson.moduleId,
            starting_stage: lesson.startingStage,
            stages: Object.fromEntries(
                Object.entries(lesson.stages).map(([stageId, stage]) => [
                    stageId,
                    {
                        "customer responses": stage.customerResponses,
                        answers: stage.answers,
                        next_stage: stage.nextStage,
                        pipWords: stage.pipWords,
                    },
                ]),
            ),
        });
    }

    async addLessonToModule({ moduleId, title, description }, lessonId) {
        await db.collection("modules").updateOne(
            { module_id: moduleId },
            {
                $setOnInsert: { module_id: moduleId, title, description },
                $addToSet: { lessons: lessonId },
            },
            { upsert: true },
        );
    }
}
