import { ListLessonsInputData } from '../../application/use_cases/ListLessons/ListLessonsInputData.js';

export function createListLessonsController({ ListLessonsUseCase }){
    return async function ListLessonsController(req, res, next) {
        const { moduleId } = req.params;
        if (!moduleId) {
            return res.status(400).json({ error: "Module ID is required" });
        }
        try {
            const inputData = new ListLessonsInputData({ moduleId });
            const responseData = await ListLessonsUseCase.execute(inputData);
            return res.status(200).json(responseData);
        } catch (error) {
            return next(error);
        }
    };
}