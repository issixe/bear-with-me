// Unit tests for the AddLesson use case

import test from "node:test";
import assert from "node:assert/strict";
import { AddLessonInteractor } from "../../src/application/use_cases/AddLesson/AddLessonInteractor.js";
import { AddLessonInputData } from "../../src/application/use_cases/AddLesson/AddLessonInputData.js";
import { AddLessonOutputData } from "../../src/application/use_cases/AddLesson/AddLessonOutputData.js";
import { Lesson } from "../../src/enterprise/entities/lesson.js";
import { createLessonValidationChain } from "../../src/enterprise/services/CreateLessonValidationChain.js";
import { validLessonInput } from "./LessonFixture.js";

// ---- fakes ----
function createFakeDataAccess({ existingIds = [], failOnSave = false } = {}) {
  return {
    calls: [],
    savedLesson: null,
    moduleUpdate: null,
    async lessonExists(lessonId) {
      this.calls.push("lessonExists");
      return existingIds.includes(lessonId);
    },
    async saveLesson(lesson) {
      this.calls.push("saveLesson");
      if (failOnSave) throw new Error("database down");
      this.savedLesson = lesson;
    },
    async addLessonToModule(module, lessonId) {
      this.calls.push("addLessonToModule");
      this.moduleUpdate = { module, lessonId };
    },
  };
}

function createFakePresenter() {
  return {
    successData: null,
    failData: null,
    prepareSuccessView(outputData) {
      this.successData = outputData;
    },
    prepareFailView(failData) {
      this.failData = failData;
    },
  };
}

const passingValidator = { validate: () => null };
const failingValidator = (message) => ({ validate: () => message });

function setup({ validator = passingValidator, ...dataAccessOptions } = {}) {
  const dataAccess = createFakeDataAccess(dataAccessOptions);
  const presenter = createFakePresenter();
  const interactor = new AddLessonInteractor({
    dataAccess,
    presenter,
    validator,
  });
  return { dataAccess, presenter, interactor };
}

const input = () => new AddLessonInputData(validLessonInput());

// ---- success ----
test("valid new lesson: prepares success view with lesson and module ids", async () => {
  const { presenter, interactor } = setup();
  await interactor.execute(input());
  assert.equal(presenter.failData, null);
  assert.ok(presenter.successData instanceof AddLessonOutputData);
  assert.equal(presenter.successData.lessonId, "late_delivery");
  assert.equal(presenter.successData.moduleId, "custom_lessons");
});

test("valid new lesson: saves a Lesson entity in the custom lessons module", async () => {
  const { dataAccess, interactor } = setup();
  await interactor.execute(input());
  assert.ok(dataAccess.savedLesson instanceof Lesson);
  assert.equal(dataAccess.savedLesson.lessonId, "late_delivery");
  assert.equal(dataAccess.savedLesson.title, "Handling a Late Delivery");
  assert.equal(dataAccess.savedLesson.moduleId, "custom_lessons");
  assert.equal(dataAccess.savedLesson.startingStage, "opening");
  assert.deepEqual(dataAccess.savedLesson.stages, validLessonInput().stages);
});

test("valid new lesson: adds the lesson id to the Custom Lessons module", async () => {
  const { dataAccess, interactor } = setup();
  await interactor.execute(input());
  assert.equal(dataAccess.moduleUpdate.lessonId, "late_delivery");
  assert.equal(dataAccess.moduleUpdate.module.moduleId, "custom_lessons");
  assert.equal(dataAccess.moduleUpdate.module.title, "Custom Lessons");
});

test("valid new lesson: saves the lesson before updating the module", async () => {
  const { dataAccess, interactor } = setup();
  await interactor.execute(input());
  assert.deepEqual(dataAccess.calls, [
    "lessonExists",
    "saveLesson",
    "addLessonToModule",
  ]);
});

test("execute returns nothing (results go through the presenter)", async () => {
  const { interactor } = setup();
  assert.equal(await interactor.execute(input()), undefined);
});

// ---- validation failure ----
test("invalid lesson: prepares invalid fail view with the validator's message", async () => {
  const { presenter, interactor } = setup({
    validator: failingValidator("title is required"),
  });
  await interactor.execute(input());
  assert.equal(presenter.successData, null);
  assert.deepEqual(presenter.failData, {
    reason: "invalid",
    message: "title is required",
  });
});

test("invalid lesson: does not touch the database", async () => {
  const { dataAccess, interactor } = setup({
    validator: failingValidator("bad"),
  });
  await interactor.execute(input());
  assert.deepEqual(dataAccess.calls, []);
});

test("passes the input data to the validator", async () => {
  let received = null;
  const spyValidator = {
    validate(lesson) {
      received = lesson;
      return null;
    },
  };
  const { interactor } = setup({ validator: spyValidator });
  const data = input();
  await interactor.execute(data);
  assert.equal(received, data);
});

// ---- duplicate ----
test("duplicate lesson id: prepares duplicate fail view", async () => {
  const { presenter, interactor } = setup({ existingIds: ["late_delivery"] });
  await interactor.execute(input());
  assert.equal(presenter.successData, null);
  assert.equal(presenter.failData.reason, "duplicate");
  assert.match(presenter.failData.message, /late_delivery/);
});

test("duplicate lesson id: does not save or update the module", async () => {
  const { dataAccess, interactor } = setup({ existingIds: ["late_delivery"] });
  await interactor.execute(input());
  assert.deepEqual(dataAccess.calls, ["lessonExists"]);
});

// ---- database error ----
test("database error while saving: error propagates and module is not updated", async () => {
  const { dataAccess, presenter, interactor } = setup({ failOnSave: true });
  await assert.rejects(() => interactor.execute(input()), /database down/);
  assert.equal(dataAccess.moduleUpdate, null);
  assert.equal(presenter.successData, null);
});

// ---- with the real chain ----
test("with the real validation chain: an invalid upload is rejected before saving", async () => {
  const { dataAccess, presenter, interactor } = setup({
    validator: createLessonValidationChain(),
  });
  const bad = validLessonInput();
  delete bad.stages.opening.customerResponses.angry;
  await interactor.execute(new AddLessonInputData(bad));
  assert.equal(presenter.failData.reason, "invalid");
  assert.match(presenter.failData.message, /angry/);
  assert.deepEqual(dataAccess.calls, []);
});
