// FindWorstCallsOutputData.js
export class FindWorstCallsOutputData {
  constructor({ conversations, receivedCount }) {
    this.conversations = conversations;
    this.receivedCount = receivedCount;
    this.returnedCount = conversations.length;
  }
}