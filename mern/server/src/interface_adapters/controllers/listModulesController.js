import { listModulesInputData } from
    '../../application/use_cases/listModules/listModulesInputData.js';

export function createListModulesController({ listModules }) {
    return async function listModulesController(req, res, next) {
        try {
            const inputData = new listModulesInputData();
            const responseData = await listModules.execute(inputData);

            return res.status(200).json(responseData);
        } catch (error) {
            return next(error);
        }
    };
}