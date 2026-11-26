// 1. Receive the agent ID and selected lesson ID.
// 2. Load the lesson and check that it exists.
// 3. Use domain logic to create a session with:
//    - cScore: 0
//    - the lesson's starting stage
//    - the initial customer mood
//    - empty answer history
//    - status: "in_progress"
// 4. Save the new session.
// 5. Return the session ID, opening customer response,
//    and available answer options without their scores.

import { Session } from "../../../enterprise/entities/Session.js";
import { StartSessionInputBoundary } from "./StartSessionInputBoundary.js";
import { StartSessionOutputData } from "./StartSessionOutputData.js";

export class StartSessionInteractor extends StartSessionInputBoundary {
    constructor({ dataAccess, presenter }) {
        super();
        this.dataAccess = dataAccess;
        this.presenter = presenter;
    }

    async execute({ agentId, lessonId }) {
        // Check that the agent and lesson referenced actually exist
        // TODO: restore once users are seeded

        // if (!agentId) {
        //   throw new Error("Agent ID is required");
        // }

        if (!lessonId) {
            this.presenter.prepareFailView("Lesson ID is required");
            return;
        }

        const lesson = await this.dataAccess.getLessonById(lessonId);

        if (!lesson) {
            this.presenter.prepareFailView(
                `Lesson with ID ${lessonId} not found`,
            );
            return;
        }

        const module = await this.dataAccess.findModuleForLesson(lessonId);

        const stage = lesson.startingStage;
        const customerMood = "angry";

        const session = new Session({ agentId, lessonId, stage, customerMood });

        const sessionId = await this.dataAccess.saveNewSession(session);

        const customerResponse = lesson.getCustomerResponses(
            lesson.startingStage,
            customerMood,
        );

        const options = lesson.getUserResponses(lesson.startingStage);

        const pipWords = lesson.getPipWords(lesson.startingStage);

        const outputData = new StartSessionOutputData({
            sessionId,
            lessonId,
            title: lesson.title,
            moduleId: module?.moduleId ?? null,
            moduleTitle: module?.title ?? null,
            stageCount: Object.keys(lesson.stages).length,
            stage,
            customerMood,
            customerResponse,
            pipWords,
            options,
        });

        this.presenter.prepareSuccessView(outputData);
    }
}
