import express from "express";
import cors from "cors";

import { MongoListModulesDataAccess } from "./src/database/dataAccess/MongoListModuleDataAccess.js";
import { MongoListLessonsDataAccess } from "./src/database/dataAccess/MongoListLessonsDataAccess.js";
import { createListModulesRoute } from "./src/routes/ListModulesRoute.js";
import { createListLessonsRoute } from "./src/routes/ListLessonsRoute.js";
import { MongoSubmitAnswerDataAccess } from "./src/database/dataAccess/MongoSubmitAnswerDataAccess.js";
import { createSubmitAnswerRoute } from "./src/routes/SubmitAnswerRoute.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

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
        dataAccess: new MongoListLessonsDataAccess()
    })
);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
