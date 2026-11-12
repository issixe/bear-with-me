import express from "express";
import cors from "cors";


import { MongoListModulesDataAccess } from "./src/database/dataAccess/MongoListModuleDataAccess.js";
import { createListModulesRoute } from "./src/routes/listModulesRoute.js";
import { MongoListLessonsDataAccess } from "./src/database/dataAccess/MongoListLessonsDataAccess.js";
import { createListLessonsRoute } from "./src/routes/listLessonRoute.js";


const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

const moduleData = new MongoListModulesDataAccess();

const lessonData = new MongoListLessonsDataAccess();

app.use(
  "/modules/:moduleId/lessons",
  createListLessonsRoute({ moduleData, lessonData })
);

app.use(
    "/modules",
    createListModulesRoute({ moduleData })
);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});