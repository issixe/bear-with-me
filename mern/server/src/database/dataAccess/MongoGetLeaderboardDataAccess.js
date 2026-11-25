import db from "../connection.js";

export class MongoGetLeaderboardDataAccess {
    async getTopUsers({ weekStart, topCount }) {
        const users = await db
            .collection("users")
            .find(
                { pointsWeekStart: weekStart, totalPoints: { $gt: 0 } },
                { projection: { username: 1, totalPoints: 1 } },
            )
            .sort({ totalPoints: -1, username: 1 })
            .limit(topCount)
            .toArray();

        return users.map((user) => [
            user._id.toString(),
            user.username || "Unknown User",
            user.totalPoints,
        ]);
    }
}
