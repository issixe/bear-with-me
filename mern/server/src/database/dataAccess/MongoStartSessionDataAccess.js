import { ObjectId } from "mongodb";
import db from "../connection.js";
import { StartSessionDataAccess } from "../../application/use_cases/StartSession/StartSessionDataAccess.js";
import { Lesson } from "../../enterprise/entities/lesson.js";

export class MongoStartSessionDataAccess extends StartSessionDataAccess {
  async getUserById(agentId) {
    if (!ObjectId.isValid(agentId)) {
      return null;
    }
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(agentId) });

    if (!user) {
      return null;
    }
    return {
      user,
    };
  }

  async getLessonById(lessonId) {
    const lesson = await db
      .collection("lessons")
      .findOne({ lesson_id: lessonId });

    if (!lesson) {
      return null;
    }

    const stages = Object.fromEntries(
      Object.entries(lesson.stages).map(([stageId, stage]) => [stageId,
    {
      ...stage,
      "customer responses":
        stage["customer responses"] ?? stage["customer response"],
    },
  ]),
);

    return new Lesson({
      lessonId: lesson.lesson_id,
      title: lesson.title,
      startingStage: lesson.starting_stage,
      stages,
    });
  }

  async saveNewSession(session) {
    const result = await db.collection("sessions").insertOne({
      agentId: session.agentId,
      lessonId: session.lessonId,
      cScore: session.cScore,
      stage: session.stage,
      customerMood: session.customerMood,
      answerHistory: session.answerHistory,
      status: session.status,
    });
    return result.insertedId.toString();
  }
}
