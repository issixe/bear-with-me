import express from "express";
import cors from "cors";

import { ListModulesInteractor } from "./src/application/use_cases/ListModules/ListModulesInteractor.js";
import { MongoListModulesDataAccess } from "./src/database/dataAccess/ListModulesDataAccess.js";
import { ListModulesPresenter } from "./src/interface_adapters/presenters/ListModulesPresenter.js";
import { createListModulesController } from "./src/interface_adapters/controllers/ListModulesController.js";
import { createListModulesRoute } from "./src/routes/ListModulesRoute.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

const moduleData = new MongoListModulesDataAccess();
const modulePresenter = new ListModulesPresenter();

const ListModules = new ListModulesInteractor({
    moduleData,
    outputBoundary: modulePresenter
});

const ListModulesController = createListModulesController({
    ListModules
});

app.use(
    "/modules",
    createListModulesRoute({
        ListModulesController
    })
);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});