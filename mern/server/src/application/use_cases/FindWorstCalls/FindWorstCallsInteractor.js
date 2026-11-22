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
        let unscoredCount = 0;
        if (!call || typeof call !== 'object') {
            this.outputBoundary.prepareFailureView(`Invalid call data at index ${i}.`);
            return;
        }
        if (call.customerPartnerRating == null) {
            unscored++;
            continue;
        }
        if (!Number.isSafeInteger(call.customerPartnerRating)) {
            this.outputBoundary.prepareFailureView(`Invalid customer partner rating at index ${i}.`);
            return;
        }

        worstCalls.push(call);
        worstCalls.sort((call1, call2) => call1.customerPartnerRating - call2.customerPartnerRating);

        if (worstCalls.length > 3) { // Keep only the 3 worst calls
            worstCalls.pop();
        }

    }
    const outputData = new FindWorstCallsOutputData({
        calls: worstCalls,
        receivedCount: calls.length,
        unscoredCount: unscoredCount,
    });

    this.outputBoundary.prepareSuccessView(outputData);
  }
}