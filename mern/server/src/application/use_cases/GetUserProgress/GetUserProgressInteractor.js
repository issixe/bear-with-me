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
    constructor({ dataAccess, presenter }) {
        super();
        this.dataAccess = dataAccess;
        this.presenter = presenter;
    }

    async execute({ userId }) {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const userProfile = await this.dataAccess.getUserById(userId);

        if (!userProfile) {
            throw new Error(`User with ID ${userId} not found`);
        }

        const outputData = new GetUserProgressOutputData({
            userId: userProfile.userId,
            streak: userProfile.streak,
            totalPoints: userProfile.totalPoints,
            completedModules: userProfile.completedModules,
        });

        return this.presenter.present(outputData);
    }
}
