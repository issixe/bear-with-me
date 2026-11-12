# Backend 
Not finalized -- more features could be added
## Backend structure 
```text
mern/server/
├── server.js
├── package.json
├── src/
│   ├── routes/
│   │   └── getUserProgressRoute.js
│   ├── enterprise/
│   │   └── entities/
│   │       ├── lesson.js
│   │       ├── module.js
│   │       ├── session.js
│   │       └── user.js
│   ├── application/
│   │   └── use_cases/
│   │       ├── CompleteLesson/
│   │       │   ├── CompleteLessonDataAccess.js
│   │       │   ├── CompleteLessonInputBoundary.js
│   │       │   ├── CompleteLessonInputData.js
│   │       │   ├── CompleteLessonInteractor.js
│   │       │   ├── CompleteLessonOutputBoundary.js
│   │       │   └── CompleteLessonOutputData.js
│   │       ├── SubmitAnswer/
│   │       │   ├── SubmitAnswer.js
│   │       │   ├── SubmitAnswerInputBoundary.js
│   │       │   ├── SubmitAnswerInputData.js
│   │       │   ├── SubmitAnswerInteractor.js
│   │       │   ├── SubmitAnswerOutput.js
│   │       │   └── SubmitAnswerOutputBoundary.js
│   │       ├── getSessionResults/
│   │       │   ├── getSessionResultsDataAccess.js
│   │       │   ├── getSessionResultsInputBoundary.js
│   │       │   ├── getSessionResultsInputData.js
│   │       │   ├── getSessionResultsInteractor.js
│   │       │   ├── getSessionResultsOutputBoundary.js
│   │       │   └── getSessionResultsOutputData.js
│   │       ├── getUserProgress/
│   │       │   ├── getUserProgressDataAccess.js
│   │       │   ├── getUserProgressInputBoundary.js
│   │       │   ├── getUserProgressInputData.js
│   │       │   ├── getUserProgressInteractor.js
│   │       │   ├── getUserProgressOutputBoundary.js
│   │       │   └── getUserProgressOutputData.js
│   │       ├── listLessons/
│   │       │   ├── listLessonsDataAccess.js
│   │       │   ├── listLessonsInputBoundary.js
│   │       │   ├── listLessonsInputData.js
│   │       │   ├── listLessonsInteractor.js
│   │       │   ├── listLessonsOutputBoundary.js
│   │       │   └── listLessonsOutputData.js
│   │       ├── listModules/
│   │       │   ├── ListModulesInteractor.js
│   │       │   ├── listModulesDataAccess.js
│   │       │   ├── listModulesInputBoundary.js
│   │       │   ├── listModulesInputData.js
│   │       │   ├── listModulesOutputBoundary.js
│   │       │   └── listModulesOutputData.js
│   │       └── startTrainingSession/
│   │           └── StartTrainingSession.js
│   ├── interface_adapters/
│   │   ├── controllers/
│   │   │   ├── CompleteLessonController.js
│   │   │   └── getUserProgressController.js
│   │   └── presenters/
│   │       ├── CompleteLessonPresenter.js
│   │       └── getUserProgressPresenter.js
│   └── database/
│       ├── connection.js
│       ├── dataAccess/
│       │   ├── CompleteLessonDataAccess.js
│       │   └── getUserProgressDataAccess.js
│       └── seeds/
│           ├── seed.js
│           └── seedData.js
├── tests/
│   └── domain/
│       └── domain.test.js
└── package-lock.json
```

This tree reflects files currently present in the repository. `server.js` imports
HTTP route modules from `src/interfaces/http/routes/`, but those files are not
present in the current tree, so the documented application architecture and
runtime wiring are not yet aligned.

## Vocabulary 

|Concept|Definition|
|----|----|
| Module | A training module can contain several lessons, listed by lesson ID.|
| Lesson |One lesson is one conversation of agent & customer |
| Answer | Agent’s answer among different given option to reply to the customer |
| Customer Response | Customer’s response / text to the agent (aka player) |
| Stage | One step in a lesson’s conversation, containing customer dialogue and available agent answers.|
| Session | One agent’s attempt at a lesson, tracking their current stage, selected answers, score, mood, and status.|
| Agent | The person who completing the training module |
| Agent profile | Information about an agent, including their identity and training progress: overall points, daily streak, and completed lessons.|

## Use case files present

The application layer currently contains use-case files for listing modules
and lessons, starting a training session, submitting an answer, completing a
lesson, retrieving session results, and retrieving user progress. Several are
split into input/output data, boundaries, and interactors. This inventory
describes files in the repository; it does not imply that all use cases are
connected to the Express server.

## Domain entities 
|Entity|Data|
|---|---|
|Module|`module_id`, title, description, `lessons` (lesson ID list)|
|Lesson|`lesson_id`, title, starting stage, stages, customer responses, answer options and their scores|
|Session|Agent ID, lesson ID, current stage, mood, cScore, answer history, status|
|AgentProfile|Agent identity, overall points, completed lessons, streak information| 

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

The current entity files are `module.js`, `lesson.js`, `session.js`, and
`user.js` under `src/enterprise/entities/`. There are no domain service files
in the current backend tree.

## Components responsibility 
|Component|Job|
|---|---|
|Route|Defines an HTTP method and URL, such as POST /sessions, and directs matching requests to a controller.|
|Controller|Handles HTTP communication: reads and validates request input, calls a use case, and converts its result into an HTTP response.|
|Use case|Performs one application operation. The current use-case files are under `src/application/use_cases/`; their runtime wiring varies.|
|Domain|The `enterprise/entities/` directory currently contains module, lesson, session, and user entity files. Separate scoring or streak service files are not present.|
|Data access|The current `src/database/dataAccess/` files provide MongoDB-facing data access for user progress and lesson completion. Separate repository contracts and repository implementations are not present in the current tree.|
