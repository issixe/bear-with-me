// FindWorstCallsOutputData.js
export class FindWorstCallsOutputData {
    constructor({ calls, receivedCount, unscoredCount }) {
        this.calls = calls;
        this.receivedCount = receivedCount;
        this.unscoredCount = unscoredCount;
        this.returnedCount = calls.length;
    }
}
