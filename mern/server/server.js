import express from "express";
import cors from "cors";

import { MongoListModulesDataAccess } from "./src/database/dataAccess/MongoListModuleDataAccess.js";
import { MongoListLessonsDataAccess } from "./src/database/dataAccess/MongoListLessonsDataAccess.js";
import { createListModulesRoute } from "./src/routes/ListModulesRoute.js";
import { createListLessonsRoute } from "./src/routes/ListLessonsRoute.js";
import { MongoStartSessionDataAccess } from "./src/database/dataAccess/MongoStartSessionDataAccess.js";
import { createStartSessionRoute } from "./src/routes/StartSessionRoute.js";
import { MongoGetLeaderboardDataAccess } from './src/database/dataAccess/MongoGetLeaderboardDataAccess.js';
import { createGetLeaderboardRoute } from './src/routes/GetLeaderboardRoute.js';

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
  "/sessions",
  createStartSessionRoute({
    dataAccess: new MongoStartSessionDataAccess(),
  }),
);

app.use(
  "/leaderboard",
  createGetLeaderboardRoute({
    dataAccess: new MongoGetLeaderboardDataAccess(),
  })
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
