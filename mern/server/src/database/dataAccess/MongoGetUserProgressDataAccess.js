import { ObjectId } from "mongodb";
import { GetUserProgressDataAccess } from "../../application/use_cases/GetUserProgress/GetUserProgressDataAccess.js";
import db from "../connection.js";

export class MongoGetUserProgressDataAccess extends GetUserProgressDataAccess {
    async getUserById(userId) {
        if (!ObjectId.isValid(userId)) {
            return null;
        }
        const user = await db.collection("users").findOne(
            { _id: new ObjectId(userId) },
            //TODO: define projection to match existing user profile structure
        );

        if (!user) {
            return null;
        }
        return {
            userId: user._id.toString(),
            totalPoints: user.totalPoints,
            completedLessonIds: user.completedLessonIds,
            streak: user.streak,
        };
    }
}
