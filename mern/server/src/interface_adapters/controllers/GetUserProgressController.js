import { GetUserProgressInputData } from "../../application/use_cases/GetUserProgress/GetUserProgressInputData.js";

export function createGetUserProgressController({ getUserProgress }) {
    return async function getUserProgressController(req, res, next) {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        try {
            const inputData = new GetUserProgressInputData({ userId });
            const responseData = await getUserProgress.execute(inputData);

            return res.status(200).json(responseData);
        } catch (error) {
            return next(error);
        }
    };
}
