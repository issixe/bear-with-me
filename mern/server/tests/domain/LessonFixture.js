// Provides lesson to use for tests

const answer = (text, score) => ({
  text,
  scores: {
    compliance: score,
    process: score,
    communication: score,
    efficiency: score,
    outcome: score,
  },
});

const stage = (nextStage) => ({
  customerResponses: {
    calm: "Calm text",
    frustrated: "Frustrated text",
    angry: "Angry text",
  },
  answers: {
    A: answer("Good answer", 95),
    B: answer("Okay answer", 50),
    C: answer("Bad answer", 10),
  },
  nextStage,
});

// A fresh, valid lesson each call, so tests can change it freely
export function validLessonInput() {
  return {
    lessonId: "late_delivery",
    title: "Handling a Late Delivery",
    startingStage: "opening",
    stages: {
      opening: stage("investigation"),
      investigation: stage("resolution"),
      resolution: stage(null),
    },
  };
}
