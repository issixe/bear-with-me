import test from "node:test";
import assert from "node:assert/strict";
import { ListModulesInteractor } from "../../src/application/use_cases/ListModules/ListModulesInteractor.js";
import { ListModulesInputData } from "../../src/application/use_cases/ListModules/ListModulesInputData.js";
import { ListModulesOutputData } from "../../src/application/use_cases/ListModules/ListModulesOutputData.js";

// building fake dependencies
function createFakeDataAccess({ modules = [], shouldThrow = false } = {}) {
    return {
        async findAll() {
            if (shouldThrow) {
                throw new Error("DB connection failed");
            }
            return modules;
        },
        async findModuleById() {
            return null;
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

test("modules exist, ListModulesInteractor prepares success view with all lessons", async () => {
    const dataAccess = createFakeDataAccess({
        modules: [
            {
                id: "mod1",
                title:"Conflict Resolution",
                description: "Handling high conflict situations",
                lessonIds: ["les1", "les2"],
            },
        ],
    });
    const presenter = createFakePresenter();
    const interactor = new ListModulesInteractor({
        dataAccess,
        outputBoundary: presenter,
    });

    await interactor.execute(new ListModulesInputData());

    assert.equal(presenter.failMessage, null);
    assert.ok(presenter.successData instanceof ListModulesOutputData);
    assert.deepEqual(presenter.successData.modules, [
        {
            id: "mod1",
            title: "Conflict Resolution",
            description: "Handling high conflict situations",
            lessonIds: ["les1", "les2"],
        },
    ]);
});

test("no modules exist, ListModulesInteractor prepares success view with empty modules", async () => {
    const dataAccess = createFakeDataAccess({ modules: [] });
    const presenter = createFakePresenter();
    const interactor = new ListModulesInteractor({
        dataAccess,
        outputBoundary: presenter,
    });

    await interactor.execute(new ListModulesInputData());

    assert.equal(presenter.failMessage, null);
    assert.deepEqual(presenter.successData.modules, []);
});

test("dataAccess throws error, ListModulesInteractor prepares fail view", async () => {
    const dataAccess = createFakeDataAccess({ shouldThrow: true });
    const presenter = createFakePresenter();
    const interactor = new ListModulesInteractor({
        dataAccess,
        outputBoundary: presenter,
    });

    await interactor.execute(new ListModulesInputData());

    assert.equal(presenter.successData, null);
    assert.equal(presenter.failMessage, "Could not load modules.");
})