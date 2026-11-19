import test from "node:test";
import assert from "node:assert/strict";
import { ListLessonsInteractor } from "../../src/application/use_cases/ListLessons/ListLessonsInteractor.js";
import { ListLessonsInputData } from "../../src/application/use_cases/ListLessons/ListLessonsInputData.js";
import { ListLessonsOutputData } from "../../src/application/use_cases/ListLessons/ListLessonsOutputData.js";

// building fake dependencies
function createFakeDataAccess({ module = null, lessons = [] } = {}) {
    return {
        async findModuleById(moduleId) {
            if (!module || module.id !== moduleId) {
                return null;
            }
            return module;
        },
        async findLessonsByModuleId(moduleId) {
            if (!module || module.id !== moduleId) {
                return [];
            }
            return lessons;
        },
    };
}

function createFakePresenter() {
    return {
        successData: null,
        failMessage: null,
        prepareSuccessView(outputData) {
            this.successData = outputData;
        },
        prepareFailView(errorMessage) {
            this.failMessage = errorMessage;
        },
    };
}

test("module exists, ListLessonsInteractor prepares success view with mapped lessons", async () => {
    const dataAccess = createFakeDataAccess({
        module: { id: "mod1", title: "Conflict Resolution", lessonIds: ["les1", "les2"] },
        lessons: [
            { id: "les1", title: "Double Billing"},
            { id: "les2", title: "Refund"},
        ],
    });
    const presenter = createFakePresenter();
    const interactor = new ListLessonsInteractor({
        dataAccess,
        outputBoundary: presenter,
    });

    await interactor.execute(new ListLessonsInputData({ moduleId: "mod1"}));

    assert.equal(presenter.failMessage, null);
    assert.ok(presenter.successData instanceof ListLessonsOutputData);
    assert.deepEqual(presenter.successData.lessons, [
        { id: "les1", title: "Double Billing"},
        { id: "les2", title: "Refund"},
    ]);
});

test("module exists with no lessons, ListLessonInteractor prepares success view with empty lessons", async () => {
    const dataAccess = createFakeDataAccess({
        module: { id: "modEmpty", title: "Empty Module", lessonIds: [] },
        lessons: [],
    });
    const presenter = createFakePresenter();
    const interactor = new ListLessonsInteractor({
        dataAccess,
        outputBoundary: presenter,
    });

    await interactor.execute(new ListLessonsInputData({ moduleId: "modEmpty"}));

    assert.equal(presenter.failMessage, null);
    assert.equal(presenter.successData.moduleId, "modEmpty");
    assert.deepEqual(presenter.successData.lessons, []);
});

test("moduleId is missing, ListLessonInteractor prepares fail view", async () => {
    const dataAccess = createFakeDataAccess();
    const presenter = createFakePresenter();
    const interactor = new ListLessonsInteractor({
        dataAccess,
        outputBoundary: presenter,
    });

    await interactor.execute(new ListLessonsInputData({ moduleId: ""}));
    
    assert.equal(presenter.successData, null);
    assert.equal(presenter.failMessage, "Module ID is required");
});

test("module does not exist, ListLessonInteractor prepares fail view", async () => {
    const dataAccess = createFakeDataAccess({ module: null });
    const presenter = createFakePresenter();
    const interactor = new ListLessonsInteractor({
        dataAccess,
        outputBoundary: presenter,
    });

    await interactor.execute(new ListLessonsInputData({ moduleId: "modMissing"}));

    assert.equal(presenter.successData, null);
    assert.equal(presenter.failMessage, 'Module "modMissing" not found.');
});