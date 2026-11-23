import { GetUserProgressInputBoundary } from 
'../../application/use_cases/GetUserProgress/GetUserProgressInputBoundary.js';
import { GetUserProgressInputData } from
'../../application/use_cases/GetUserProgress/GetUserProgressInputData.js';

export function createGetUserProgressController({ getUserProgress }) {
  return async function getUserProgressController(req, res, next) {
    const { agentId } = req.params;

    if (!agentId) {
      return res.status(400).json({ error: "Agent ID is required" });
    }

    try {
      const inputData = new GetUserProgressInputData({ agentId });
      const responseData = await getUserProgress.execute(inputData);

      return res.status(200).json(responseData);
    } catch (error) {
      return next(error);
    }
  };
}