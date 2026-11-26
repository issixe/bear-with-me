import test from "node:test";
import assert from "node:assert/strict";
import { Lesson } from "../../src/enterprise/entities/Lesson.js";
import { Session } from "../../src/enterprise/entities/Session.js";
import { Module } from "../../src/enterprise/entities/Module.js";
import { StartSessionInteractor } from "../../src/application/use_cases/StartSession/StartSessionInteractor.js";
import { SubmitAnswerInteractor } from "../../src/application/use_cases/SubmitAnswer/SubmitAnswerInteractor.js";

for (const normalized of [false, true]) {
  test(`start and submit through completion with ${normalized ? "normalized" : "stored"} stage fields`, async () => {
    const stage = next => ({
      [normalized ? "customerResponses" : "customer responses"]: { angry: "Hello", calm: "Thanks" },
      [normalized ? "nextStage" : "next_stage"]: next,
      answers: { A: { text: "Help", scores: { communication: 80 } } },
      pipWords: "Keep going",
    });
    const lesson = new Lesson({ lessonId: "lesson", title: "Lesson", startingStage: "first", stages: { first: stage("last"), last: stage(null) } });
    let saved;
    let opening;
    await new StartSessionInteractor({ dataAccess: {
      getLessonById: async () => lesson,
      findModuleForLesson: async () => ({ moduleId: "module", title: "Module" }),
      saveNewSession: async session => { saved = session; return "session"; },
    }, presenter: { prepareSuccessView: value => { opening = value; } } }).execute({ agentId: "agent", lessonId: "lesson" });
    assert.equal(saved.agentId, "agent");
    assert.equal(opening.moduleId, "module");
    assert.equal(opening.stageCount, 2);
    assert.equal(opening.options[0].answerId, "A");
    const module = new Module({ moduleId: "module", lessons: ["lesson"], weights: { communication: 1 } });
    module.moodThreshold = { angry: [0, 75], calm: [75, null] };
    let writes = 0;
    const interactor = new SubmitAnswerInteractor({
      findSessionById: async () => saved,
      findModuleById: async () => module,
      findLessonById: async () => lesson,
      saveSession: async () => { writes++; },
    }, { prepareSuccessView: value => value });
    const first = await interactor.execute({ sessionId: "session", moduleId: "module", answerId: "A", stageId: "first" });
    assert.equal(first.cScore, 80);
    assert.equal(first.stageId, "last");
    assert.equal(first.customerResponse, "Thanks");
    assert.equal(first.pipWords, "Keep going");
    const last = await interactor.execute({ sessionId: "session", moduleId: "module", answerId: "A", stageId: "last" });
    assert.equal(last.cScore, 160);
    assert.equal(last.isFinished, true);
    assert.deepEqual(last.answerOptions, []);
    assert.equal(writes, 2);
    assert.ok(saved instanceof Session);
  });
}
