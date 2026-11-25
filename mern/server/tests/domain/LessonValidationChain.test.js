// Tests for the Chain of Responsibility validator chain

import test from "node:test";
import assert from "node:assert/strict";
import { createLessonValidationChain } from "../../src/enterprise/services/CreateLessonValidationChain.js";
import { PipWordsValidator } from "../../src/enterprise/services/PipWordsValidator.js";
import { RequiredFieldsValidator } from "../../src/enterprise/services/RequiredFieldsValidator.js";
import { StartingStageValidator } from "../../src/enterprise/services/StartingStageValidator.js";
import { validLessonInput } from "./LessonFixture.js";

const validate = (lesson) => createLessonValidationChain().validate(lesson);

test("a valid lesson passes the whole chain", () => {
  assert.equal(validate(validLessonInput()), null);
});

// RequiredFieldsValidator
test("missing title is rejected", () => {
  const lesson = validLessonInput();
  delete lesson.title;
  assert.match(validate(lesson), /title is required/);
});

test("blank lessonId is rejected", () => {
  const lesson = validLessonInput();
  lesson.lessonId = "   ";
  assert.match(validate(lesson), /lessonId is required/);
});

test("lessonId with capitals or dashes is rejected", () => {
  const lesson = validLessonInput();
  lesson.lessonId = "Late-Delivery";
  assert.match(validate(lesson), /lowercase letters, numbers and underscores/);
});

test("empty stages object is rejected", () => {
  const lesson = validLessonInput();
  lesson.stages = {};
  assert.match(validate(lesson), /at least one stage/);
});

test("non-object upload is rejected", () => {
  assert.match(validate(null), /must be a JSON object/);
});

// StartingStageValidator
test("startingStage that isn't a stage is rejected", () => {
  const lesson = validLessonInput();
  lesson.startingStage = "intro";
  assert.match(
    validate(lesson),
    /starting_stage "intro" is not one of the stages/,
  );
});

// CustomerResponsesValidator
test("stage missing customer responses is rejected", () => {
  const lesson = validLessonInput();
  delete lesson.stages.investigation.customerResponses;
  assert.match(
    validate(lesson),
    /"investigation" is missing customer responses/,
  );
});

test("stage missing one mood is rejected", () => {
  const lesson = validLessonInput();
  lesson.stages.resolution.customerResponses.calm = "";
  assert.match(
    validate(lesson),
    /"resolution" is missing the "calm" customer response/,
  );
});

// PipWordsValidator
test("empty pipWords on every stage is accepted", () => {
  // the fixture uses "" for every stage
  assert.equal(validate(validLessonInput()), null);
});

test("pipWords with text is accepted", () => {
  const lesson = validLessonInput();
  lesson.stages.opening.pipWords = "You got this!";
  assert.equal(validate(lesson), null);
});

test("missing pipWords is rejected", () => {
  const lesson = validLessonInput();
  delete lesson.stages.opening.pipWords;
  assert.match(validate(lesson), /"opening" is missing pipWords/);
});

test("null pipWords is rejected", () => {
  const lesson = validLessonInput();
  lesson.stages.investigation.pipWords = null;
  assert.match(validate(lesson), /"investigation" is missing pipWords/);
});

test("non-string pipWords is rejected", () => {
  const lesson = validLessonInput();
  lesson.stages.resolution.pipWords = 123;
  assert.match(validate(lesson), /"resolution" is missing pipWords/);
});

test("pipWords error message tells the user they can use an empty string", () => {
  const lesson = validLessonInput();
  delete lesson.stages.opening.pipWords;
  assert.match(validate(lesson), /use "" if Pip has nothing to say/);
});

test("PipWordsValidator works on its own outside the chain", () => {
  const lesson = validLessonInput();
  assert.equal(new PipWordsValidator().validate(lesson), null);
  delete lesson.stages.resolution.pipWords;
  assert.match(
    new PipWordsValidator().validate(lesson),
    /"resolution" is missing pipWords/,
  );
});

test("chain order: customer responses are checked before pipWords", () => {
  const lesson = validLessonInput();
  delete lesson.stages.opening.customerResponses.angry; // CustomerResponsesValidator
  delete lesson.stages.opening.pipWords; // PipWordsValidator
  assert.match(validate(lesson), /missing the "angry" customer response/);
});

test("chain order: pipWords is checked before answers", () => {
  const lesson = validLessonInput();
  delete lesson.stages.opening.pipWords; // PipWordsValidator
  lesson.stages.opening.answers.A.text = ""; // AnswersValidator
  assert.match(validate(lesson), /"opening" is missing pipWords/);
});

// AnswersValidator
test("stage with too few answers is rejected", () => {
  const lesson = validLessonInput();
  delete lesson.stages.opening.answers.C;
  assert.match(validate(lesson), /needs at least \d+ answers/);
});

test("answer without text is rejected", () => {
  const lesson = validLessonInput();
  lesson.stages.opening.answers.B.text = "";
  assert.match(validate(lesson), /answer "B" is missing text/);
});

test("score given as a string is rejected", () => {
  const lesson = validLessonInput();
  lesson.stages.opening.answers.A.scores.process = "95";
  assert.match(
    validate(lesson),
    /"process" score must be a number from 0 to 100/,
  );
});

test("score above 100 is rejected", () => {
  const lesson = validLessonInput();
  lesson.stages.opening.answers.A.scores.outcome = 120;
  assert.match(
    validate(lesson),
    /"outcome" score must be a number from 0 to 100/,
  );
});

test("missing score criterion is rejected", () => {
  const lesson = validLessonInput();
  delete lesson.stages.opening.answers.A.scores.compliance;
  assert.match(validate(lesson), /"compliance" score/);
});

// NextStageValidator
test("nextStage pointing to a missing stage is rejected", () => {
  const lesson = validLessonInput();
  lesson.stages.investigation.nextStage = "closing";
  assert.match(validate(lesson), /nextStage "closing", which is not a stage/);
});

test("missing nextStage (undefined instead of null) is rejected", () => {
  const lesson = validLessonInput();
  delete lesson.stages.resolution.nextStage;
  assert.match(validate(lesson), /which is not a stage/);
});

test("stages that loop forever are rejected", () => {
  const lesson = validLessonInput();
  lesson.stages.resolution.nextStage = "opening";
  assert.match(validate(lesson), /loop back to "opening"/);
});

test("unreachable stage is rejected", () => {
  const lesson = validLessonInput();
  lesson.stages.investigation.nextStage = null;
  assert.match(validate(lesson), /can't be reached.*resolution/);
});

// Chain behaviour
test("chain order: missing stages is caught by the first validator, not a crash later", () => {
  const lesson = validLessonInput();
  delete lesson.stages;
  assert.doesNotThrow(() => validate(lesson));
  assert.match(validate(lesson), /stages must be an object/);
});

test("chain stops at the first problem", () => {
  const lesson = validLessonInput();
  delete lesson.title; // RequiredFieldsValidator
  lesson.stages.resolution.nextStage = "x"; // NextStageValidator
  assert.match(validate(lesson), /title is required/);
});

test("a single handler with no next handler returns null on success", () => {
  assert.equal(new StartingStageValidator().validate(validLessonInput()), null);
});

test("setNext returns the next handler so calls can be chained", () => {
  const first = new RequiredFieldsValidator();
  const second = new StartingStageValidator();
  assert.equal(first.setNext(second), second);
});
