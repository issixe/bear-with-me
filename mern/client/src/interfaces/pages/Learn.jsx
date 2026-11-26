import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import pip from "../../assets/pip/thumbs-up.png";
import { useServices } from "../context/ServicesContext";
import { useLessons } from "../hooks/useLessons";
import { useOpenLesson } from "../hooks/useSessions";
import { useCurrentUser } from "../hooks/useUsers";
import ModuleComplete from "./ModuleComplete";

const Learn = () => {
  const location = useLocation();
  const session = location.state?.session ?? null;

  if (!session) return <Navigate to="/" replace />;
  return <Lesson key={session.sessionId} session={session} />;
};

function Lesson({ session }) {
  const { lessons: moduleLessons } = useLessons(session.moduleId);
  const currentIndex = moduleLessons.findIndex(
    (item) => item.id === session.lessonId,
  );
  const nextLessonId =
    currentIndex >= 0 ? moduleLessons[currentIndex + 1]?.id : null;
  const { sessionService } = useServices();
  const { user } = useCurrentUser();
  const { openLesson, opening, error: startError } = useOpenLesson(user?.id);

  // StartSession currently returns stage/options.
  // SubmitAnswer returns stageId/answerOptions.
  const [sessionProgress, setSessionProgress] = useState(() =>
    session
      ? {
          ...session,
          stageId: session.stageId ?? session.stage,
          answerOptions: session.answerOptions ?? session.options ?? [],
          isFinished: session.isFinished ?? false,
        }
      : null,
  );

  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const submittingRef = useRef(false);
  const latest = useRef(null);

  const stageId = sessionProgress?.stageId;
  const mood = sessionProgress?.customerMood;
  const customer = sessionProgress?.customerResponse ?? "";
  const options = sessionProgress?.answerOptions ?? [];
  const complete = sessionProgress?.isFinished ?? false;
  const pipWords = sessionProgress?.pipWords;

  // Visual indicator based on the mood returned by the backend.
  const cScore = sessionProgress?.cScore ?? 0;
  const maxScore = session.stageCount * 100;

  const progress = Math.round((history.length / session.stageCount) * 100);

  useEffect(() => {
    if (history.length)
      latest.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [history.length]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  async function choose(answerId) {
    if (submittingRef.current || complete) return;

    if (!sessionProgress?.sessionId || !user?.id || !session.moduleId) {
      setSubmitError("Open the lesson from the module list first.");
      return;
    }

    const selectedAnswer = options.find(
      (option) => option.answerId === answerId,
    );

    if (!selectedAnswer) return;

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await sessionService.submitAnswer({
        sessionId: sessionProgress.sessionId,
        userId: user.id,
        moduleId: session.moduleId,
        stageId,
        answerId,
      });

      setHistory((previous) => [
        ...previous,
        {
          stageId,
          customer,
          mood,
          answer: selectedAnswer.text,
          score: result.earnedScore,
        },
      ]);

      // The backend supplies the next stage, mood, and options.
      setSessionProgress(result);
    } catch (error) {
      setSubmitError(error.message || "Could not submit your answer.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function speak(text) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }

  function customerMessage(text, customerMood) {
    return (
      <div className="flex items-start gap-3">
        <span
          className="text-3xl"
          role="img"
          aria-label={`${customerMood} customer`}
        >
          {customerMood === "angry"
            ? "😠"
            : customerMood === "frustrated"
              ? "😐"
              : "🙂"}
        </span>
        <div className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-white p-4">
          <p className="mb-2 text-sm font-bold">Customer</p>
          <p>{text}</p>
        </div>
        {"speechSynthesis" in window && (
          <button
            type="button"
            onClick={() => speak(text)}
            aria-label="Read customer message aloud"
            className="rounded-full border border-stone-300 p-2 hover:bg-white"
          >
            🔊
          </button>
        )}
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl text-[#24413B] md:flex">
      <section className="min-w-0 flex-1 bg-[var(--background)]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 bg-white p-5">
          <h1 className="text-xl font-extrabold">{session.title}</h1>
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="score">
              Customer Satisfaction Score: {cScore.toFixed(0)} points
            </label>
            <meter
              id="score"
              min={0}
              max={maxScore}
              value={cScore}
              className="h-3 w-28"
            >
              {cScore.toFixed(0)} / {maxScore}
            </meter>
          </div>
          <div className="w-full text-sm">
            <label htmlFor="lesson-progress">
              Lesson progress: {progress}%
            </label>
            <progress
              id="lesson-progress"
              max="100"
              value={progress}
              className="mt-1 block h-2 w-full accent-[#287F6E]"
            >
              {progress}%
            </progress>
          </div>
        </header>

        <div className="space-y-6 p-4 md:p-6">
          {(submitError || startError) && (
            <p role="alert" className="text-red-700">
              {submitError || startError.message}
            </p>
          )}
          <Link to="/" className="font-bold hover:underline">
            ← My Progress
          </Link>
          {history.map((turn) => (
            <div key={turn.stageId} className="space-y-4">
              {customerMessage(turn.customer, turn.mood)}
              <div className="ml-8 rounded-2xl border border-[#287F6E] bg-white p-4 md:ml-24">
                <p className="mb-2 text-sm font-bold">Your response</p>
                <p>{turn.answer}</p>
              </div>
            </div>
          ))}
          <div ref={latest} aria-live="polite">
            {typeof pipWords === "string" && pipWords.trim() && (
              <div className="mb-6 flex items-center gap-3">
                <img
                  src={pip}
                  alt=""
                  className="h-16 w-16 shrink-0 object-contain"
                />
                <div className="min-w-0 rounded-2xl border border-[#287F6E] bg-white p-4">
                  <p className="mb-1 text-sm font-bold">Pip</p>
                  <p className="whitespace-pre-line">{pipWords}</p>
                </div>
              </div>
            )}
            {complete ? (
              <ModuleComplete
                lessonTitle={session.title}
                moduleTitle={session.moduleTitle}
                scores={history.map((turn) => turn.score)}
                cScore={cScore}
                onContinue={
                  nextLessonId ? () => openLesson(nextLessonId) : null
                }
                opening={opening}
              />
            ) : (
              <div className="space-y-4">
                {customerMessage(customer, mood)}
                <fieldset className="ml-8 min-w-0 rounded-2xl border border-stone-200 bg-white p-4 md:ml-24">
                  <legend className="px-2 font-bold">Your response</legend>
                  <div className="space-y-3">
                    {options.map((option) => (
                      <button
                        key={option.answerId}
                        type="button"
                        onClick={() => choose(option.answerId)}
                        disabled={submitting}
                        className="w-full rounded-xl border border-stone-200 p-3 text-left hover:border-[#287F6E] hover:bg-[var(--selection)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287F6E]"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Learn;
