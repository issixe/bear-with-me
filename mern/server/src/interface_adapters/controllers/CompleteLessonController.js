import { CompleteLessonInputData } from "../../application/use_cases/CompleteLesson/CompleteLessonInputData.js";

export function createCompleteLessonController({ CompleteLesson }) {
    return async function CompleteLessonController(req, res, next) {
        const { sessionId } = req.params;
        const { userId, username, sessionScore } = req.body;

        if (!userId || !sessionId || !Number.isFinite(sessionScore)) {
            return res
                .status(400)
                .json({ error: "userId, sessionId, and a valid sessionScore are required" });
        }

        try {
            const inputData = new CompleteLessonInputData({
                userId,
                sessionId,
                username,
                sessionScore,
            });
            const responseData = await CompleteLesson.execute(inputData);
            return res.status(200).json(responseData);
        } catch (error) {
            return next(error);
        }
    };
}
