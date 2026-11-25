import { GetUserProgressOutputBoundary } from "../../application/use_cases/GetUserProgress/GetUserProgressOutputBoundary.js";

export class GetUserProgressPresenter extends GetUserProgressOutputBoundary {
    async present(outputData) {
        return {
            userId: outputData.userId,
            streak: outputData.streak,
            totalPoints: outputData.totalPoints,
            completedModules: outputData.completedModules,
        };
    }
}
