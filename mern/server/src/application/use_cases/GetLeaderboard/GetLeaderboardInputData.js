export class GetLeaderboardInputData {
    constructor({ topCount = 5 }) {
        this.topCount = topCount;
    }
}