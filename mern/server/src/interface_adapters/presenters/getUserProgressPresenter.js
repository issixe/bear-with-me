import { GetUserProgressOutputData } from "../../application/use_cases/GetUserProgress/GetUserProgressOutputData.js";
import { GetUserProgressOutputBoundary } from "../../application/use_cases/GetUserProgress/GetUserProgressOutputBoundary.js";

export class GetUserProgressPresenter extends GetUserProgressOutputBoundary {
    async present(outputData) {
        return {
            agentId: outputData.agentId,
            streak: outputData.streak,
            totalPoints: outputData.totalPoints,
            completedModules: outputData.completedModules,
        };
    }
}
