/**
 * State of one training attempt. The caller loads and supplies scenario data;
 * this entity performs no file or database access.
 * The existing scenario schema still uses module_id and starting_stage.
 */
export class Session {
    constructor({
        id = null, // null until saved
        userId,
        lessonId,
        stage,
        customerMood,
        cScore = 0,
        answerHistory = [],
        status = "in_progress",
    }) {
        this.id = id;
        this.userId = userId;
        this.lessonId = lessonId;
        this.stage = stage;
        this.customerMood = customerMood;
        this.cScore = cScore;
        this.answerHistory = answerHistory;
        this.status = status;
    }

    /** Record earned points. cScore is intentionally a total, not Python's mean. */
    updateCScore(earnedScore) {
        if (
            !Number.isFinite(earnedScore) ||
            earnedScore < 0 ||
            earnedScore > 100
        ) {
            throw new RangeError(
                "Earned score must be a finite number between 0 and 100",
            );
        }
        this.cScore += earnedScore;
    }

    setStage(stage) {
        this.stage = stage;
    }

    endSession(status) {
        if (status !== "completed" && status !== "failed") {
            throw new Error("Status must be either 'completed' or 'failed'");
        }
        this.status = status;
    }

    /** Determine the next customer mood and update it */
    updateCustomerMood(moodThreshold) {
        for (const [mood, [min, max]] of Object.entries(moodThreshold)) {
            const meetsMinimum = this.cScore >= min;
            const belowMaximum = max === null || this.cScore < max;

            if (meetsMinimum && belowMaximum) {
                this.customerMood = mood;
                return;
            }
        }

        throw new Error(`No mood threshold matches score ${this.cScore}`);
    }

    /** Update session's stage */
    updateStage(nextStage) {
        this.stage = nextStage;
    }

    /**update the status of this session (complete, in progress) */
    updateCompletionStatus() {
        if (this.stage === null) {
            this.status = "completed";
        }
    }
}
