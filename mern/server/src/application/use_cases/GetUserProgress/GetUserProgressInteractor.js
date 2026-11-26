// 1. Receive the agent ID.
// 2. Load the agent's recorded training progress (in the agent profile).
// 3. Determine the current streak using domain rules
//    and the current date in the agreed timezone.
// 4. Return overall points, current streak,
//    and completed-lesson progress.
// 5. Do not award points or record a new completion.
import { GetUserProgressInputBoundary } from "./GetUserProgressInputBoundary.js";
import { GetUserProgressOutputData } from "./GetUserProgressOutputData.js";

export class GetUserProgressInteractor extends GetUserProgressInputBoundary {
    constructor({ dataAccess, outputBoundary }) {
        super();
        this.dataAccess = dataAccess;
        this.outputBoundary = outputBoundary;
    }

    async execute({ agentId }) {
        if (!agentId) {
            this.outputBoundary.prepareFailView("agentId is required");
            return;
        }

        const userProfile = await this.dataAccess.getUserById(agentId);

        if (!userProfile) {
            this.outputBoundary.prepareFailView(
                `User with ID ${agentId} not found`,
            );
            return;
        }

        const outputData = new GetUserProgressOutputData({
            agentId: userProfile.agentId,
            streak: userProfile.streak,
            totalPoints: userProfile.totalPoints,
            completedModules: userProfile.completedModules,
        });

        return this.outputBoundary.prepareSuccessView(outputData);
    }
}
