// 1. Receive the user ID, session ID, and selected answer ID and stage ID.
// 2. Load the session and its lesson.
// 3. Check that the session belongs to the user,
//    is in progress, and the answer belongs to its current stage.
// 4. Use domain logic to:
//    - Calculate the selected answer's earned points.
//    - Add those points to cScore.
//    - Record the answer in the session history.
//    - Determine customer mood and the next stage based on cscore.
//    - Determine whether the lesson is complete / early fail.
// 5. Return updated session progress and either:
//    - The next customer response and answer options.
//    - An indication that the session has finished.
import { SubmitAnswerInputBoundary } from "./SubmitAnswerInputBoundary.js";
import { SubmitAnswerOutputData } from "./SubmitAnswerOutputData.js";

export class SubmitAnswerInteractor extends SubmitAnswerInputBoundary {
    constructor(SubmitAnswerDataAccess, outputBoundary) {
        super();
        // Dependency injection for repositories
        this.dataAccess = SubmitAnswerDataAccess;
        this.outputBoundary = outputBoundary;
    }

    async execute(inputData) {
        // Find the session using session repository and inputData.sessionId
        const session = await this.dataAccess.findSessionById(
            inputData.sessionId,
        );

        // Validate user ownership of the session, sessions status, and stageID.
        // this.validateSubmission(session, inputData);

        // Calculate the answer's score and update user cScore
        const module = await this.dataAccess.findModuleById(inputData.moduleId); // Load the module to get the weights

        // check if moduleId exists in lesson
        if (!module) {
            throw new Error(`Module with ID ${inputData.moduleId} not found`);
        }

        // Load the lesson using session.lessonId and lesson repo
        const lesson = await this.dataAccess.findLessonById(session.lessonId);

        // check if lesson exists
        if (!lesson) {
            throw new Error(`Lesson with ID ${session.lessonId} not found`);
        }

        // check if the lesson is in the module's lessons list
        if (!module.getLessonIds().includes(session.lessonId)) {
            throw new Error(
                `Lesson with ID ${session.lessonId} is not found in module`,
            );
        }
        // Find the answer in the lesson so we can calculate the score and update the session.
        const answer = lesson.getAnswer(session.stage, inputData.answerId);

        const earnedScore = this.calculateEarnedScore(
            answer.scores,
            module.weights,
        );

        const currentStage = session.stage;
        const nextStage = lesson.getNextStage(currentStage); // next stage could be a string or null
        let pipWords = null;

        const moodThreshold = module.moodThreshold; // get the threshold determining different customer moods

        // Update session history, customer mood, stage, and completion status.
        session.updateCScore(earnedScore);
        session.updateCustomerMood(moodThreshold); // Assuming this method is in session entity

        if (nextStage === null) {
            // When we reach the final stage, update completed and get pipwords.
            session.endSession("completed");
            pipWords = lesson.getPipWords(currentStage);
        } else {
            session.updateStage(nextStage);
            pipWords = lesson.getPipWords(nextStage);
        }

        session.updateCompletionStatus(); // update the status of this session

        // Create customer response and answer options for the next stage if the session is still in progress.
        const isFinished = session.status !== "in_progress";

        let customerResponse = null;
        let answerOptions = [];

        if (!isFinished) {
            customerResponse = lesson.getCustomerResponses(
                session.stage,
                session.customerMood,
            );
            answerOptions = lesson.getUserResponses(session.stage);
        }

        const outputData = new SubmitAnswerOutputData({
            sessionId: inputData.sessionId,
            cScore: session.cScore,
            earnedScore: earnedScore,
            status: session.status,
            stageId: session.stage,
            customerMood: session.customerMood,
            customerResponse: customerResponse,
            answerOptions: answerOptions,
            pipWords: pipWords,
        });

        // Save the updated session to the database
        await this.dataAccess.saveSession(session);

        // return output data and pass it to output boundary.
        return this.outputBoundary.prepareSuccessView(outputData);
    }

    /**
     * Validate ownership, session status, and the submitted stage.
     */
    // validateSubmission(session, inputData) {
    // if (!session) {
    // throw new Error("Session not found");
    // }
    // if (session.agentId !== inputData.userId) {
    // throw new Error("User does not own this session");
    // }
    // if (session.status !== "in_progress") {
    // throw new Error("Session is not in progress");
    // }
    // if (session.stage !== inputData.stageId) {
    //  throw new Error("Session is not in the correct stage");
    //  }
    //  }

    /**
     * Calculate the score based on the answer's scores and the module's weights.
     */

    calculateEarnedScore(answerScores, moduleWeights) {
        let weightSum = 0;

        // check every weight is a finite number and non negative; sum up to be 1
        for (const [dimension, weight] of Object.entries(moduleWeights)) {
            if (!Number.isFinite(weight) || weight < 0) {
                throw new Error(`Invalid weight value for ${dimension}`);
            }
            weightSum += weight;
        }
        if (Math.abs(weightSum - 1) > 1e-9) {
            throw new Error("Weights must add up to 1.0");
        }

        // check every score is a finite number between 100 and 0;
        // check every score dimension exists in the weight dimensions.
        // check if every answer dimension has a weight
        let earnedScore = 0;
        for (const [dimension, score] of Object.entries(answerScores)) {
            if (!Number.isFinite(score) || score < 0 || score > 100) {
                throw new Error(`Invalid score value for ${dimension}`);
            }

            if (!Object.hasOwn(moduleWeights, dimension)) {
                throw new Error(
                    `Dimension ${dimension} not found in module weights`,
                );
            }

            if (
                Object.keys(answerScores).length !==
                Object.keys(moduleWeights).length
            ) {
                throw new Error(
                    "Scores and weights must have the same dimensions",
                );
            }

            earnedScore += score * moduleWeights[dimension];
        }

        return earnedScore;
    }
}
