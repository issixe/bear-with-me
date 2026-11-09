import { CompleteLessonInputData } from '../../application/use_cases/CompleteLesson/CompleteLessonInputData.js';
 
export function createCompleteLessonController({ CompleteLesson }) {
    return async function CompleteLessonController(req, res, next) {
        const { agentId, sessionId } = req.params;
 
        if (!agentId || !sessionId) {
            return res.status(400).json({ error: 'agentId and sessionId are required' });
        }
 
        try {
            const inputData = new CompleteLessonInputData({ agentId, sessionId });
            const responseData = await CompleteLesson.execute(inputData);
            return res.status(200).json(responseData);
        } catch (error) {
            return next(error);
        }
    };
}
 