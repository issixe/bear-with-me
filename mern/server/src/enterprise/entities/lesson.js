/**
 * One lesson entity within a module.
 */
export class Lesson {
    constructor({ lessonId, title, moduleId, startingStage, stages }) {
        this.lessonId = lessonId;
        this.title = title;
        this.moduleId = moduleId;
        this.startingStage = startingStage;
        this.stages = stages;
    }

    /** Get Stage of the Lesson*/
    getStage(stageId) {
        const stage = this.stages[stageId];

        if (!stage) {
            throw new Error(`Stage with ID ${stageId} not found in lesson ${this.lessonId}`);
        }

        return stage;
    }

    /** Get the next stage of the lesson for given current stage */
    getNextStage(currentStageId){
        return this.stages[currentStageId].next_stage;
    }

    getPipWords(stageId){
        const stage = this.getStage(stageId);
        const pipWords = stage.pipWords;

        if (typeof pipWords !== "string") {
        throw new Error(`Pip words not found in stage ${stageId}`);
        }

        return pipWords; 

    }

    /** Get all possible customer responses for a given stage and mood */
    getCustomerResponses(stageId, mood) {
        const stage = this.getStage(stageId);
        const responses = stage["customer responses"]?.[mood];
        if (typeof responses !==  "string") {
            throw new Error(`Customer responses for mood "${mood}" not found in stage ${stageId} of lesson ${this.lessonId}`);
        }

        return responses;
    }
    /** Get all possible user responses for a given stage, along with text to display */
    getUserResponses(stageId) {
        const stage = this.getStage(stageId);
        const responses = stage.answers;

        if (!responses || typeof responses !== "object") {
            throw new Error(`User responses not found in stage ${stageId} of lesson ${this.lessonId}`);
        }

        return Object.entries(responses).map(([answerId, answer]) => ({answerId, text: answer.text,
    }));
    }

    /** Get the full response to use in backend score/mood calculation for a given answer in a given stage */

    getAnswer(stageId, answerId) {
        const stage = this.getStage(stageId);
        const answer = stage.answers?.[answerId];

        if (!answer) {
            throw new Error(`Answer with ID ${answerId} not found in stage ${stageId} of lesson ${this.lessonId}`);
        }
        return { answerId, text: answer.text, scores: { ...answer.scores } };
    }
}