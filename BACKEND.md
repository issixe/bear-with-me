# Backend 
Not finalized -- more features could be added
## Backend structure 
```text
mern/server/
├── server.js
├── package.json
├── package-lock.json
├── src/
│   ├── routes/
│   │   ├── CompleteLessonRoute.js
│   │   ├── GetLeaderboardRoute.js
│   │   ├── GetUserProgressRoute.js
│   │   ├── ListLessonRoute.js
│   │   ├── ListLessonsRoute.js
│   │   ├── ListModulesRoute.js
│   │   └── StartSessionRoute.js
│   ├── application/
│   │   └── use_cases/
│   │       ├── CompleteLesson/
│   │       │   ├── CompleteLessonDataAccess.js
│   │       │   ├── CompleteLessonInputBoundary.js
│   │       │   ├── CompleteLessonInputData.js
│   │       │   ├── CompleteLessonInteractor.js
│   │       │   ├── CompleteLessonOutputBoundary.js
│   │       │   └── CompleteLessonOutputData.js
│   │       ├── GetLeaderboard/
│   │       │   ├── GetLeaderboardDataAccess.js
│   │       │   ├── GetLeaderboardInputBoundary.js
│   │       │   ├── GetLeaderboardInputData.js
│   │       │   ├── GetLeaderboardInteractor.js
│   │       │   ├── GetLeaderboardOutputBoundary.js
│   │       │   └── GetLeaderboardOutputData.js
│   │       ├── GetUserProgress/
│   │       │   ├── GetUserProgressDataAccess.js
│   │       │   ├── GetUserProgressInputBoundary.js
│   │       │   ├── GetUserProgressInputData.js
│   │       │   ├── GetUserProgressInteractor.js
│   │       │   ├── GetUserProgressOutputBoundary.js
│   │       │   └── GetUserProgressOutputData.js
│   │       ├── ListLessons/
│   │       │   ├── ListLessonsDataAccess.js
│   │       │   ├── ListLessonsInputBoundary.js
│   │       │   ├── ListLessonsInputData.js
│   │       │   ├── ListLessonsInteractor.js
│   │       │   ├── ListLessonsOutputBoundary.js
│   │       │   └── ListLessonsOutputData.js
│   │       ├── ListModules/
│   │       │   ├── ListModulesDataAccess.js
│   │       │   ├── ListModulesInputBoundary.js
│   │       │   ├── ListModulesInputData.js
│   │       │   ├── ListModulesInteractor.js
│   │       │   ├── ListModulesOutputBoundary.js
│   │       │   └── ListModulesOutputData.js
│   │       ├── StartSession/
│   │       │   ├── StartSessionDataAccess.js
│   │       │   ├── StartSessionInputBoundary.js
│   │       │   ├── StartSessionInputData.js
│   │       │   ├── StartSessionInteractor.js
│   │       │   ├── StartSessionOutputBoundary.js
│   │       │   └── StartSessionOutputData.js
│   │       └── SubmitAnswer/
│   │           ├── SubmitAnswer.js
│   │           ├── SubmitAnswerInputBoundary.js
│   │           ├── SubmitAnswerInputData.js
│   │           ├── SubmitAnswerInteractor.js
│   │           ├── SubmitAnswerOutput.js
│   │           └── SubmitAnswerOutputBoundary.js
│   ├── enterprise/
│   │   └── entities/
│   │       ├── Lesson.js
│   │       ├── Module.js
│   │       ├── Session.js
│   │       └── User.js
│   ├── interface_adapters/
│   │   ├── controllers/
│   │   │   ├── CompleteLessonController.js
│   │   │   ├── GetLeaderboardController.js
│   │   │   ├── GetUserProgressController.js
│   │   │   ├── ListLessonsController.js
│   │   │   ├── ListModulesController.js
│   │   │   └── StartSessionController.js
│   │   ├── presenters/
│   │   │   ├── CompleteLessonPresenter.js
│   │   │   ├── GetLeaderboardPresenter.js
│   │   │   ├── GetUserProgressPresenter.js
│   │   │   ├── ListLessonsPresenter.js
│   │   │   ├── ListModulesPresenter.js
│   │   │   └── StartSessionPresenter.js
│   │   └── viewModels/
│   │       ├── CompleteLessonViewModel.js
│   │       ├── GetLeaderboardViewModel.js
│   │       ├── ListLessonsViewModel.js
│   │       ├── ListModulesViewModel.js
│   │       └── StartSessionViewModel.js
│   └── database/
│       ├── connection.js
│       ├── dataAccess/
│       │   ├── MongoCompleteLessonDataAccess.js
│       │   ├── MongoGetLeaderboardDataAccess.js
│       │   ├── MongoGetUserProgressDataAccess.js
│       │   ├── MongoListLessonsDataAccess.js
│       │   ├── MongoListModuleDataAccess.js
│       │   └── MongoStartSessionDataAccess.js
│       └── seeds/
│           ├── seed.js
│           └── seedData.js
└── tests/
    ├── domain/
    │   ├── ListLessonsInteractor.test.js
    │   ├── ListModulesInteractor.test.js
    │   └── domain.test.js
    ├── enterprise/
    │   └── User.test.js
    └── routes/
        └── Leaderboard.test.js
```

`server.js` wires the module, lesson, session-start, lesson-completion, and
leaderboard routes. `GetUserProgressRoute.js` and `ListLessonRoute.js` are also
present in the source tree but are not mounted by `server.js`.

## Vocabulary 

|Concept|Definition|
|----|----|
| Module | A training module can contain several lessons, listed by lesson ID.|
| Lesson | One lesson is one conversation between a user and a customer. |
| Answer | A user's selected response to the customer. |
| Customer Response | The customer's response to the user. |
| Stage | One step in a lesson's conversation, containing customer dialogue and available user answers. |
| Session | One user's attempt at a lesson, tracking their current stage, selected answers, score, mood, and status. |
| User | The person completing the training module. |
| User profile | Information about a user, including their identity and training progress: overall points, daily streak, and completed lessons.|

## Use case files present

The application layer contains use cases for listing modules and lessons,
starting a session, submitting an answer, completing a lesson, retrieving the
leaderboard, and retrieving user progress. `server.js` currently wires the
module, lesson, session-start, lesson-completion, and leaderboard routes.
`GetUserProgressRoute.js` and `ListLessonRoute.js` are present but are not
mounted by `server.js`.

## Domain entities 
|Entity|Data|
|---|---|
|Module|`module_id`, title, description, `lessons` (lesson ID list)|
|Lesson|`lesson_id`, title, starting stage, stages, customer responses, answer options and their scores|
|Session|User ID, lesson ID, current stage, mood, cScore, answer history, status|
|User|`userId`, `username`, weekly points, `completedModules`, `streak`, `lastActivity`, `lessonScores`, and `pointsWeekStart`|

## Seed data

From `mern/server`, run `npm run seed` after setting `ATLAS_URI` in `config.env`.
The example records are defined in `src/database/seeds/seedData.js`. A module
contains a `lessons` array of lesson IDs; the current `conflict_resolution`
module references the `double_billing` lesson. The seeder inserts module
records into `modules` and lesson records into `lessons` in the `bear_db`
database.

Before inserting, the seeder clears **all documents** from both collections.
Do not run it against a database whose module or lesson data needs to be
preserved.

## Entities

The current entity files are `Module.js`, `Lesson.js`, `Session.js`, and
`User.js` under `src/enterprise/entities/`. There are no domain service files
in the current backend tree.

## Components responsibility 
|Component|Job|
|---|---|
|Route|Defines an HTTP method and URL, such as POST /sessions, and directs matching requests to a controller.|
|Controller|Handles HTTP communication: reads and validates request input, calls a use case, and converts its result into an HTTP response.|
|Use case|Performs one application operation. The current use-case files are under `src/application/use_cases/`; their runtime wiring varies.|
|Domain|The `enterprise/entities/` directory currently contains module, lesson, session, and user entity files. Separate scoring or streak service files are not present.|
|Data access|Use cases define data-access boundaries under `src/application/use_cases/`; MongoDB implementations are under `src/database/dataAccess/`.|
