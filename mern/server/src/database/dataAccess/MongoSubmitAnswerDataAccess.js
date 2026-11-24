import db from "../connection.js";
import { ObjectId } from "mongodb";
import { SubmitAnswerDataAccess } from "../../application/use_cases/SubmitAnswer/SubmitAnswerDataAccess.js";
import { Session } from "../../enterprise/entities/session.js";
import { Lesson } from "../../enterprise/entities/Lesson.js";
import { Module } from "../../enterprise/entities/module.js";

export class MongoSubmitAnswerDataAccess extends SubmitAnswerDataAccess {
    async findSessionById(sessionId) {
        if (!ObjectId.isValid(sessionId)) {
        return null;
    }

    const doc = await db.collection("sessions").findOne({
        _id: new ObjectId(sessionId),
    });

    if (!doc) {
        return null;
    }

    return new Session({
        id: doc._id.toString(),
        agentId: doc.agentId?.toString(),
        lessonId: doc.lessonId,
        stage: doc.stage,
        customerMood: doc.customerMood,
        cScore: doc.cScore ?? 0,
        answerHistory: doc.answerHistory ?? [],
        status: doc.status ?? "in_progress",
    });
}

    async findLessonById(lessonId) {
        const doc = await db.collection("lessons").findOne({
        lesson_id: lessonId,
        });

    if (!doc) {
        return null;
    }

    const stages = Object.fromEntries(
        Object.entries(doc.stages ?? {}).map(([stageId, stage]) => [
        stageId,
        {
            ...stage,
            "customer responses":
            stage["customer responses"] ?? stage["customer response"],
        },
    ]),
    );

    return new Lesson({
        lessonId: doc.lesson_id,
        title: doc.title,
        moduleId: doc.module_id,
        startingStage: doc.starting_stage,
        stages,
    });
}

    async findModuleById(moduleId) {
        const doc = await db.collection("modules").findOne({
        module_id: moduleId,
    });

    if (!doc) {
        return null;
    }

    const module = new Module({
        moduleId: doc.module_id,
        title: doc.title,
        description: doc.description,
        lessons: doc.lessons ?? [],
        weights: doc.weights ?? doc.moduleWeight ?? {},
    });

    // The current Module constructor does not accept moodThreshold.
    // Attach the stored value because the interactor expects it.
    module.moodThreshold = doc.moodThreshold ?? doc.mood_threshold;

    if (!module.moodThreshold) {
        throw new Error(
            `Module "${moduleId}" is missing moodThreshold configuration`,
    );
    }

    return module;
}

    async saveSession(session) {
        if (!session.id || !ObjectId.isValid(session.id)) {
        throw new Error("Cannot save a session without a valid MongoDB ID");
        }

        const result = await db.collection("sessions").updateOne(
        { _id: new ObjectId(session.id) },
        {
            $set: {
            cScore: session.cScore,
            stage: session.stage,
            customerMood: session.customerMood,
            answerHistory: session.answerHistory,
            status: session.status,
            },
        },
        );

        if (result.matchedCount === 0) {
            throw new Error("Session no longer exists");
        }

        return session;
    }
}