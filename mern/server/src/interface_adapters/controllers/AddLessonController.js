import { AddLessonInputData } from "../../application/use_cases/AddLesson/AddLessonInputData.js";

export class AddLessonController {
    constructor(inputBoundary) {
        this.inputBoundary = inputBoundary;
    }

    execute(body) {
        const stages = Object.fromEntries(
            Object.entries(body?.stages ?? {}).map(([stageId, stage]) => [
                stageId,
                {
                    customerResponses: stage?.["customer responses"],
                    answers: stage?.answers,
                    nextStage: stage?.next_stage,
                    pipWords: stage?.pipWords,
                },
            ]),
        );

        return this.inputBoundary.execute(
            new AddLessonInputData({
                lessonId: body?.lesson_id,
                title: body?.title,
                startingStage: body?.starting_stage,
                stages,
            }),
        );
    }
}
