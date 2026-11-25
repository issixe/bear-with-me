import express from "express";
import { getWeekStartDateKey } from "../enterprise/entities/User.js";

export function createGetLeaderboardRoute({ dataAccess }) {
    const router = express.Router();

    router.get("/", async (req, res, next) => {
        const rawTopCount = req.query.topCount;
        const topCount = rawTopCount === undefined ? 5 : Number(rawTopCount);

        if (!Number.isInteger(topCount) || topCount < 1 || topCount > 100) {
            return res.status(400).json({
                error: "topCount must be an integer between 1 and 100",
            });
        }

        try {
            const leaderboard = await dataAccess.getTopUsers({
                weekStart: getWeekStartDateKey(),
                topCount,
            });
            return res.status(200).json({ leaderboard });
        } catch (error) {
            return next(error);
        }
    });

    return router;
}
