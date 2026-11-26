// 1. Receive the user ID.
// 2. Load the user's recorded training progress.
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

    async execute({ userId }) {
        if (!userId) {
            this.outputBoundary.prepareFailView("userId is required");
            return;
        }

        const userProfile = await this.dataAccess.getUserById(userId);

        if (!userProfile) {
            this.outputBoundary.prepareFailView(
                `User with ID ${userId} not found`,
            );
            return;
        }

        const outputData = new GetUserProgressOutputData({
            userId: userProfile.userId,
            streak: userProfile.streak,
            totalPoints: userProfile.totalPoints,
            completedModules: userProfile.completedModules,
        });

        return this.outputBoundary.prepareSuccessView(outputData);
    }
}
