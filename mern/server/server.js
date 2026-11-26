import cors from "cors";
import express from "express";
import { MongoListLessonsDataAccess } from "./src/database/dataAccess/MongoListLessonsDataAccess.js";
import { MongoListModulesDataAccess } from "./src/database/dataAccess/MongoListModuleDataAccess.js";
import { createFindWorstCallsRoute } from "./src/routes/FindWorstCallsRoute.js";
import { createListLessonsRoute } from "./src/routes/ListLessonsRoute.js";
import { MongoSubmitAnswerDataAccess } from "./src/database/dataAccess/MongoSubmitAnswerDataAccess.js";
import { createSubmitAnswerRoute } from "./src/routes/SubmitAnswerRoute.js";
import { MongoStartSessionDataAccess } from "./src/database/dataAccess/MongoStartSessionDataAccess.js";
import { createStartSessionRoute } from "./src/routes/StartSessionRoute.js";
import { MongoCompleteLessonDataAccess } from "./src/database/dataAccess/MongoCompleteLessonDataAccess.js";
import { createCompleteLessonRoute } from "./src/routes/CompleteLessonRoute.js";
import { MongoGetLeaderboardDataAccess } from './src/database/dataAccess/MongoGetLeaderboardDataAccess.js';
import { createGetLeaderboardRoute } from './src/routes/GetLeaderboardRoute.js';
import { MongoAddLessonDataAccess } from "./src/database/dataAccess/MongoAddLessonDataAccess.js";
import { createAddLessonRoute } from "./src/routes/AddLessonRoute.js";
import { createListModulesRoute } from "./src/routes/ListModulesRoute.js";
import { createGetUserProgressRoute } from "./src/routes/GetUserProgressRoute.js";
import { MongoGetUserProgressDataAccess } from "./src/database/dataAccess/MongoGetUserProgressDataAccess.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/sessions",
  createStartSessionRoute({
    dataAccess: new MongoStartSessionDataAccess(),
  }),
);

app.use(
  "/sessions",
  createSubmitAnswerRoute({
    dataAccess: new MongoSubmitAnswerDataAccess(),
  }),
);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = Number.isInteger(error.status) ? error.status : 500;

  if (status >= 500) {
    console.error(error);
  }

  return res.status(status).json({
    error: status >= 500 ? "Internal server error" : error.message,
  });
});

app.use(
    "/modules",
    createListModulesRoute({
        dataAccess: new MongoListModulesDataAccess()
    })
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

app.use(
  "/sessions",
  createCompleteLessonRoute({
    dataAccess: new MongoCompleteLessonDataAccess(),
  }),
);

app.use(
  "/leaderboard",
  createGetLeaderboardRoute({
    dataAccess: new MongoGetLeaderboardDataAccess(),
  }),
);

 app.use(
  "/lessons",
  createAddLessonRoute({ dataAccess: new MongoAddLessonDataAccess() }),
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
