import { FindWorstCallsOutputBoundary } from 
'../../application/use_cases/FindWorstCalls/FindWorstCallsOutputBoundary.js';

export class FindWorstCallsPresenter extends FindWorstCallsOutputBoundary {
    constructor(viewModel) {
        super();
        this.viewModel = viewModel;
    }

    prepareSuccessView(outputData) {
        this.viewModel.httpStatus = 200;
        this.viewModel.body = {
            calls: outputData.calls,
            receivedCount: outputData.receivedCount,
            returnedCount: outputData.returnedCount,
            unscoredCount: outputData.unscoredCount
        };
    }

    prepareFailView(msg) {
        this.viewModel.httpStatus = 400;
        this.viewModel.body = { error: msg };
    }
}