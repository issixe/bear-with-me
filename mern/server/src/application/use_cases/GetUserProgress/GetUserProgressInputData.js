// 1. Receive the user ID.
// 2. Load the user's recorded training progress.
// 3. Determine the current streak using domain rules
//    and the current date in the agreed timezone.
// 4. Return overall points, current streak,
//    and completed-lesson progress.
// 5. Do not award points or record a new completion.

export class GetUserProgressInputData {
    constructor({ userId }) {
        this.userId = userId;
    }
}
