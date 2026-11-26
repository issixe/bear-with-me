import test from "node:test";
import assert from "node:assert/strict";
import { User } from "../../src/enterprise/entities/User.js";
import { CompleteLessonInteractor } from "../../src/application/use_cases/CompleteLesson/CompleteLessonInteractor.js";

test("recordLessonCompletion resets weekly points and advances a consecutive streak", () => {
    const user = new User({
        userId: "user-1",
        totalPoints: 100,
        pointsWeekStart: "2026-11-16",
        lessonScores: { "old-session": 100 },
        streak: 2,
        lastActivity: "2026-11-22",
    });

    user.recordLessonCompletion({
        sessionId: "session-1",
        sessionScore: 75,
        date: new Date(2026, 10, 23, 12),
    });

    assert.equal(user.totalPoints, 75);
    assert.deepEqual(user.lessonScores, { "session-1": 75 });
    assert.equal(user.pointsWeekStart, "2026-11-23");
    assert.equal(user.streak, 3);
    assert.equal(user.lastActivity, "2026-11-23");
});

test("recordLessonCompletion applies score differences without double-counting same-day streaks", () => {
    const user = new User({
        userId: "user-1",
        totalPoints: 70,
        pointsWeekStart: "2026-11-23",
        lessonScores: { "session-1": 70 },
        streak: 4,
        lastActivity: "2026-11-24",
    });
    const date = new Date(2026, 10, 24, 12);

    user.recordLessonCompletion({
        sessionId: "session-1",
        sessionScore: 85,
        date,
    });
    user.recordLessonCompletion({
        sessionId: "session-1",
        sessionScore: 85,
        date,
    });

    assert.equal(user.totalPoints, 85);
    assert.equal(user.streak, 4);
});

test("CompleteLessonInteractor delegates progress changes to User and persists both records", async () => {
    const user = new User({
        userId: "user-1",
        pointsWeekStart: "2026-11-23",
    });
    const session = {
        userId: "user-1",
        sessionId: "session-1",
        cScore: 80,
        completed: false,
    };
    const saved = [];
    const interactor = new CompleteLessonInteractor({
        dataAccess: {
            findSessionById: async () => session,
            findOrCreateUser: async () => user,
            updateSession: async (value) => saved.push(value),
            updateUser: async (value) => saved.push(value),
        },
        presenter: { present: async (output) => output },
    });

    const result = await interactor.execute({
        userId: "user-1",
        sessionId: "session-1",
        sessionScore: 80,
    });

    assert.equal(user.totalPoints, 80);
    assert.equal(session.completed, true);
    assert.equal(result.userId, "user-1");
    assert.equal(result.totalPoints, 80);
    assert.deepEqual(saved, [session, user]);
});

test("recordLessonCompletion rejects invalid scores and missing session IDs", () => {
    const user = new User();

    assert.throws(
        () => user.recordLessonCompletion({ sessionId: "session-1", sessionScore: NaN }),
        RangeError,
    );
    assert.throws(
        () => user.recordLessonCompletion({ sessionScore: 10 }),
        /Session ID is required/,
    );
});
