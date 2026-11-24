import db from '../connection.js';
import { GetLeaderboardDataAccess } from '../../application/use_cases/GetLeaderboard/GetLeaderboardDataAccess.js';

export class MongoGetLeaderboardDataAccess extends GetLeaderboardDataAccess {
    async getTopUsers({ weekStart, topCount }) {
        const query = { pointsWeekStart: weekStart };
        const cursor = db
            .collection('users')
            .find(query)
            .sort({ totalPoints: -1 });

        if (topCount) {
            cursor.limit(Number(topCount));
        }

        const users = await cursor.toArray();

        return users.map((user) => ({
            userId: user._id.toString(),
            username: user.username,
            totalPoints: user.totalPoints ?? 0,
            pointsWeekStart: user.pointsWeekStart
        }));
    }
}