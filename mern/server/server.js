import express from "express";
import cors from "cors";

import { MongoListModulesDataAccess } from "./src/database/dataAccess/listModulesDataAccess.js";
import { MongoListLessonsDataAccess } from "./src/database/dataAccess/listLessonsDataAccess.js";
import { createListModulesRoute } from "./src/routes/listModulesRoute.js";
import { createListLessonsRoute } from "./src/routes/listLessonsRoute.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/modules",
    createListModulesRoute({
        dataAccess: new MongoListModulesDataAccess()
    })
);

app.use(
    "/modules",
    createListLessonsRoute({
        dataAccess: new MongoListLessonsDataAccess()
    })
);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});