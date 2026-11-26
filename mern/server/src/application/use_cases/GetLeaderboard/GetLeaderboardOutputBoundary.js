export class GetLeaderboardOutputBoundary {
    async prepareSuccessView(_outputData) {
        throw new Error("prepareSuccessView() must be implemented");
    }

    async prepareFailView(_message) {
        throw new Error("prepareFailView() must be implemented");
    }
}
