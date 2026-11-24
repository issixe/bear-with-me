import { CompleteLessonInputData } from "../../application/use_cases/CompleteLesson/CompleteLessonInputData.js";

export function createCompleteLessonController({ CompleteLesson }) {
    return async function CompleteLessonController(req, res, next) {
        const { userId, sessionId } = req.params;
 
        if (!userId || !sessionId) {
            return res.status(400).json({ error: 'userId and sessionId are required' });
        }

        try {
            const inputData = new CompleteLessonInputData({ userId, sessionId });
            const responseData = await CompleteLesson.execute(inputData);
            return res.status(200).json(responseData);
        } catch (error) {
            return next(error);
        }
    };
}
