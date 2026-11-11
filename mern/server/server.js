import express from "express";
import cors from "cors";

import { ListModulesInteractor } from "./src/application/use_cases/listModules/ListModulesInteractor.js";
import { MongoListModulesDataAccess } from "./src/database/dataAccess/listModulesDataAccess.js";
import { listModulesPresenter } from "./src/interface_adapters/presenters/listModulesPresenter.js";
import { createListModulesController } from "./src/interface_adapters/controllers/listModulesController.js";
import { createListModulesRoute } from "./src/routes/listModulesRoute.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

const moduleData = new MongoListModulesDataAccess();
const modulePresenter = new listModulesPresenter();

const listModules = new ListModulesInteractor({
    moduleData,
    outputBoundary: modulePresenter
});

const listModulesController = createListModulesController({
    listModules
});

app.use(
    "/modules",
    createListModulesRoute({
        listModulesController
    })
);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});