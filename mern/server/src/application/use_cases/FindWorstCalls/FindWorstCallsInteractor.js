//FindWorstCAllsInteractor.js

import { FindWorstCallsInputBoundary } from "./FindWorstCallsInputBoundary.js";
import { FindWorstCallsOutputData } from "./FindWorstCallsOutputData.js";

export class FindWorstCallsInteractor extends FindWorstCallsInputBoundary {
  constructor({ outputBoundary }) {
    super();
    this.outputBoundary = outputBoundary;
  }

  async execute(inputData) {
    const calls = inputData?.calls;

    if (!Array.isArray(calls)) {
        this.outputBoundary.prepareFailureView("Invalid input data: calls must be an array.");
        return;
    }

    const worstCalls = [];

    for (let i = 0; i < calls.length; i++) {
        const call = calls[i];
  }
}