import { ObjectId } from "mongodb";
import db from "../connection.js";
import { GetUserProgressDataAccess } from "../../application/use_cases/GetUserProgress/GetUserProgressDataAccess.js";

export class MongoGetUserProgressDataAccess extends GetUserProgressDataAccess {
    async getUserById(agentId) {
        if (!ObjectId.isValid(agentId)) {
            return null;
        }
        const user = await db.collection("users").findOne(
            { _id: new ObjectId(agentId) },
            //TODO: define projection to match existing user profile structure
        );

        if (!user) {
            return null;
        }
        return {
            agentId: user._id.toString(),
            totalPoints: user.totalPoints,
            completedModules: user.completedModules,
            streak: user.streak,
        };
    }
}
