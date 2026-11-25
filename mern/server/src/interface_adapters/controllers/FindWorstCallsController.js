import { FindWorstCallsInputData } from "../../application/use_cases/FindWorstCalls/FindWorstCallsInputData.js";

function parsePartnerRating(value) {
    if (typeof value === "number") {
        return Number.isSafeInteger(value) ? value : null;
    }
    if (typeof value !== "string" || !/^-?\d+$/.test(value.trim())) {
        return null;
    }
    const rating = Number(value.trim());
    return Number.isSafeInteger(rating) ? rating : null;
}

export class FindWorstCallsController {
    constructor(inputBoundary) {
        this.inputBoundary = inputBoundary;
    }
    execute(conversations) {
        const calls = Array.isArray(conversations)
            ? conversations.map((call) => {
                  if (
                      typeof call !== "object" ||
                      call === null ||
                      Array.isArray(call)
                  ) {
                      return call;
                  }

                  return {
                      customerPartnerRating: parsePartnerRating(
                          call.source_fields?.customer_survey_response
                              ?.partner_rating,
                      ),
                      sourceCall: call,
                  };
              })
            : conversations;
        return this.inputBoundary.execute(
            new FindWorstCallsInputData({ calls }),
        );
    }
}
