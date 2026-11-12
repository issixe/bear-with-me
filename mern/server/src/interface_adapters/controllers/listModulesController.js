import { ListModulesInputData } from
    '../../application/use_cases/ListModules/ListModulesInputData.js';

export function createListModulesController({ ListModules }) {
    return async function ListModulesController(req, res, next) {
        try {
            const inputData = new ListModulesInputData();
            const responseData = await ListModules.execute(inputData);

            return res.status(200).json(responseData);
        } catch (error) {
            return next(error);
        }
    };
}