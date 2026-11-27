import { ObjectId } from "mongodb";
import { CompleteLessonDataAccess } from "../../application/use_cases/CompleteLesson/CompleteLessonDataAccess.js";
import { User } from "../../enterprise/entities/User.js";
import db from "../connection.js";

function getMongoUserId(userId) {
    return ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
}

export class MongoCompleteLessonDataAccess extends CompleteLessonDataAccess {
    async findSessionById(sessionId) {
        if (!ObjectId.isValid(sessionId)) {
            return null;
        }
        const session = await db
            .collection("sessions")
            .findOne({ _id: new ObjectId(sessionId) });

        if (!session) {
            return null;
        }

        return {
            userId: session.userId?.toString(),
            sessionId: session._id.toString(),
            lessonId: session.lessonId.toString(),
            cScore: session.cScore,
            completed: session.completed,
        };
    }

    async findOrCreateUser(userId, username) {
        if (typeof userId !== "string" || !userId.trim()) {
            return null;
        }

        const userDocumentId = getMongoUserId(userId);
        const users = db.collection("users");
        await users.updateOne(
            { _id: userDocumentId },
            {
                $setOnInsert: {
                    username:
                        (typeof username === "string" && username.trim()) ||
                        "Unknown User",
                    totalPoints: 0,
                    completedLessonIds: [],
                    streak: 0,
                    lastActivity: null,
                    lessonScores: {},
                    pointsWeekStart: null,
                },
            },
            { upsert: true },
        );
        const user = await users.findOne({ _id: userDocumentId });
        if (!user) {
            throw new Error("User could not be loaded after creation");
        }

        return new User({
            userId: user._id.toString(),
            username: user.username,
            totalPoints: user.totalPoints ?? 0,
            completedLessonIds: user.completedLessonIds ?? [],
            streak: user.streak ?? 0,
            lastActivity: user.lastActivity ?? null,
            lessonScores: user.lessonScores ?? {},
            pointsWeekStart: user.pointsWeekStart ?? null,
        });
    }

    async updateSession(session) {
        await db.collection("sessions").updateOne(
            { _id: new ObjectId(session.sessionId) },
            {
                $set: {
                    completed: session.completed,
                    cScore: session.cScore,
                },
            },
        );
    }

    async updateUser(user) {
        await db.collection("users").updateOne(
            { _id: getMongoUserId(user.userId) },
            {
                $set: {
                    totalPoints: user.totalPoints,
                    completedLessonIds: user.completedLessonIds,
                    streak: user.streak,
                    lastActivity: user.lastActivity,
                    lessonScores: user.lessonScores,
                    pointsWeekStart: user.pointsWeekStart,
                },
            },
        );
    }
}
