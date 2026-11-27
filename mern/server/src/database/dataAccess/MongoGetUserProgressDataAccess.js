import { ObjectId } from "mongodb";
import { GetUserProgressDataAccess } from "../../application/use_cases/GetUserProgress/GetUserProgressDataAccess.js";
import db from "../connection.js";

export class MongoGetUserProgressDataAccess extends GetUserProgressDataAccess {
    async getUserById(userId) {
        const mongoUserId = ObjectId.isValid(userId)
            ? new ObjectId(userId)
            : userId;

        const user = await db.collection("users").findOne({ _id: mongoUserId });

        if (!user) {
            return null;
        }
        return {
            userId: user._id.toString(),
            totalPoints: user.totalPoints,
            completedLessonIds: user.completedLessonIds ?? [],
            streak: user.streak,
        };
    }
}
