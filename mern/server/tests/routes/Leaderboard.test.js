import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { User } from "../../src/enterprise/entities/User.js";
import { createCompleteLessonRoute } from "../../src/routes/CompleteLessonRoute.js";
import { createGetLeaderboardRoute } from "../../src/routes/GetLeaderboardRoute.js";

test("completing a session makes its points available on the weekly leaderboard", async () => {
    const user = new User({ userId: "dev-user" });
    const session = {
        userId: "dev-user",
        sessionId: "session-1",
        cScore: 0,
        completed: false,
    };
    const dataAccess = {
        findSessionById: async () => session,
        findOrCreateUser: async (_userId, username) => {
            user.username = username;
            return user;
        },
        updateSession: async () => {},
        updateUser: async () => {},
        getTopUsers: async ({ weekStart, topCount }) =>
            user.pointsWeekStart === weekStart && user.totalPoints > 0
                ? [{
                    userId: user.userId,
                    username: user.username,
                    totalPoints: user.totalPoints,
                    pointsWeekStart: user.pointsWeekStart,
                }].slice(0, topCount)
                : [],
    };
    const app = express();
    app.use(express.json());
    app.use("/sessions", createCompleteLessonRoute({ dataAccess }));
    app.use("/leaderboard", createGetLeaderboardRoute({ dataAccess }));
    const server = app.listen(0, "127.0.0.1");

    try {
        await new Promise((resolve) => server.once("listening", resolve));
        const { port } = server.address();
        const completion = await fetch(
            `http://127.0.0.1:${port}/sessions/session-1/complete`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: "dev-user",
                    username: "Demo User",
                    sessionScore: 120,
                }),
            },
        );
        assert.equal(completion.status, 200);
        assert.equal((await completion.json()).totalPoints, 120);

        const leaderboard = await fetch(
            `http://127.0.0.1:${port}/leaderboard?topCount=4`,
        );
        assert.equal(leaderboard.status, 200);
        assert.deepEqual(await leaderboard.json(), {
            leaderboard: [["dev-user", "Demo User", 120]],
        });
    } finally {
        await new Promise((resolve, reject) =>
            server.close((error) => (error ? reject(error) : resolve())),
        );
    }
});
