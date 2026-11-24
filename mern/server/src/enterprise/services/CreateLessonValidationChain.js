// Implements the Chain of Responsibility design pattern
import { RequiredFieldsValidator } from "./RequiredFieldsValidator.js";
import { StartingStageValidator } from "./StartingStageValidator.js";
import { CustomerResponsesValidator } from "./CustomerResponsesValidator.js";
import { AnswersValidator } from "./AnswersValidator.js";
import { NextStageValidator } from "./NextStageValidator.js";

export function createLessonValidationChain() {
  const head = new RequiredFieldsValidator(); // must be first: later ones assume fields exist
  head
    .setNext(new StartingStageValidator())
    .setNext(new CustomerResponsesValidator())
    .setNext(new AnswersValidator())
    .setNext(new NextStageValidator());
  return head;
}
