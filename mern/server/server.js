import cors from "cors";
import express from "express";
import { MongoListLessonsDataAccess } from "./src/database/dataAccess/MongoListLessonsDataAccess.js";
import { MongoListModulesDataAccess } from "./src/database/dataAccess/MongoListModuleDataAccess.js";
import { createFindWorstCallsRoute } from "./src/routes/FindWorstCallsRoute.js";
import { createListLessonsRoute } from "./src/routes/ListLessonsRoute.js";
import { createListModulesRoute } from "./src/routes/ListModulesRoute.js";
import { createGetUserProgressRoute } from "./src/routes/GetUserProgressRoute.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use(
	"/modules",
	createListModulesRoute({
		dataAccess: new MongoListModulesDataAccess(),
	}),
);

app.use(
	"/modules",
	createListLessonsRoute({
		dataAccess: new MongoListLessonsDataAccess(),
	}),
);

app.use(
    "/users",
    createGetUserProgressRoute({
        dataAccess: new MongoGetUserProgressDataAccess(),
    }),
);

app.use("/admin/calls", createFindWorstCallsRoute());

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
