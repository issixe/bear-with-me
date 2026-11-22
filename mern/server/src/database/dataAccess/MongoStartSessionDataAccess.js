import { ObjectId } from "mongodb";
import db from "../connection.js";
import { StartSessionDataAccess } from "../../application/use_cases/StartSession/StartSessionDataAccess.js";

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
    return {
      id: lesson.lesson_id,
      startingStage: lesson.starting_stage,
      initialMood: lesson.initial_mood ?? "angry",
      stages: lesson.stages,
    };
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
