import { useEffect, useRef, useState } from "react";
import { exampleModules, exampleLessons } from "../../../../server/src/database/seeds/seedData.js";
import pip from "../../assets/pip/thumbs-up.png";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useCurrentUser } from "../hooks/useUsers";
import { useOpenLesson } from "../hooks/useSessions";

const lessonOrder = exampleModules.flatMap((module) => module.lessons);

//Figuring out which lesson to show from the URL that the user clicks
const Learn = () => {
  const [params] = useSearchParams();
  const location = useLocation();
  const session = location.state?.session ?? null;

  const id = params.get("lesson") ?? "double_billing";
  //Looks through list of lessons in seedData.js and finds the one where lesson_id matches the id
  const lesson = exampleLessons.find((item) => item.lesson_id === id);

  //No lesson was found
  if (!lesson) {
    return <main className="p-6">Lesson not found. <Link to="/" className="underline">Back home</Link></main>;
  }

  return <Lesson key={session?.sessionId ?? id} lesson={lesson} session={session} />;
};

const MOOD_TENSION = { angry: 70, frustrated: 50, calm: 20 };

function Lesson({ lesson, session }) {
  const module = exampleModules.find((item) => item.lessons.includes(lesson.lesson_id));
  const [stageId, setStageId] = useState(session?.stage ?? lesson.starting_stage);
  const [tension, setTension] = useState(MOOD_TENSION[session?.customerMood] ?? 70);
  const [history, setHistory] = useState([]);
  const [complete, setComplete] = useState(false);
  const latest = useRef(null);
  const stage = lesson.stages[stageId];
  const progress = Math.round(history.length / Object.keys(lesson.stages).length * 100);
  const isFirstRound = history.length === 0 && session !== null;

  const { user } = useCurrentUser();
  const { openLesson, opening, error: startError } = useOpenLesson(user?.id);

  const mood = isFirstRound
    ? session.customerMood
    : tension > 65 ? "angry" : tension > 35 ? "frustrated" : "calm";

  const customer = isFirstRound
    ? session.customerResponse
    : stage["customer responses"][mood];

  const options = isFirstRound
    ? session.options
    : Object.entries(stage.answers).map(([answerId, a]) => ({ answerId, text: a.text }));

  //Scrolling to the newest message in the chat
  useEffect(() => {
    if (history.length) latest.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [history.length]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function choose(answerId) {
    const answer = stage.answers[answerId];
    const score =
    Object.values(answer.scores).reduce((sum, v) => sum + v, 0) /
    Object.keys(answer.scores).length;

    setHistory([...history, { stageId, customer, mood, answer: answer.text }]);
    setTension(Math.max(0, Math.min(100, tension + (score >= 75 ? -25 : score >= 40 ? 5 : 20))));
    //Continues.
    if (stage.next_stage === null) setComplete(true);
    else setStageId(stage.next_stage);
  }

  //Draws the chat bubble, emoji based on mood
  function customerMessage(text, customerMood) {
    return (
      <div className="flex items-start gap-3">
        <span className="text-3xl">
          {customerMood === "angry" ? "😠" : customerMood === "frustrated" ? "😐" : "🙂"}
        </span>
        <div className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-white p-4">
          <p className="mb-2 text-sm font-bold">Customer</p>
          <p>{text}</p>
        </div>
      </div>
    );
  }

  //Actual page. Sidebar, complete gets info for ModuleComplete screen
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl text-[#24413B]">
      <aside className="sticky top-6 max-h-[calc(100dvh-3rem)] w-56 shrink-0 self-start overflow-y-auto border-r border-stone-200 bg-white p-4">
        <Link to="/" className="font-bold hover:underline">← My Progress</Link>
        <p className="mt-6 mb-3 font-bold">{module?.title}</p>
        <nav className="flex flex-col gap-2 overflow-x-auto">
          {module?.lessons.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => openLesson(id)}
            disabled={opening}
            aria-current={id === lesson.lesson_id ? "page" : undefined}
            className={`min-w-40 shrink-0 rounded-lg p-3 text-left text-sm md:min-w-0 disabled:cursor-wait disabled:opacity-60 ${
              id === lesson.lesson_id
                ? "bg-[var(--selection)] font-bold text-[var(--selection-text)]"
                : "hover:bg-stone-100"
            }`}
          >
            {exampleLessons.find((item) => item.lesson_id === id)?.title}
          </button>
        ))}
        </nav>
        <img src={pip} alt="Pip cheering you on" className="mx-auto mt-8 hidden w-32 md:block" />
        {startError && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            Couldn't start that lesson. Try again.
          </p>
        )}
      </aside>
      {complete ? (
        <ModuleComplete
          lessonTitle={lesson.title}
          moduleTitle={module?.title}
          nextLessonId={nextLessonId}
          scores={history.map((turn) => turn.score)}
        />
      ) : (
        <section className="min-w-0 flex-1 bg-[var(--background)]">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 bg-white p-5">
            <h1 className="text-xl font-extrabold">{lesson.title}</h1>
            <div className="flex items-center gap-2 text-sm">
              <label htmlFor="tension">Tension {tension}%</label>
              <meter id="tension" min="0" max="100" low="35" high="65" optimum="0" value={tension} className="w-28">{tension}%</meter>
            </div>
            <div className="w-full text-sm">
              <label htmlFor="lesson-progress">Lesson progress: {progress}%</label>
              <progress id="lesson-progress" max="100" value={progress} className="mt-1 block h-2 w-full accent-[#287F6E]">{progress}%</progress>
            </div>
          </header>

          <div className="space-y-6 p-6">
            {history.map((turn) => (
              <div key={turn.stageId} className="space-y-4">
                {customerMessage(turn.customer, turn.mood)}
                <div className="ml-24 rounded-2xl border border-[#287F6E] bg-white p-4">
                  <p className="mb-2 text-sm font-bold">Your response</p>
                  <p>{turn.answer}</p>
                </div>
              </div>
            ))}

            <div ref={latest}>
              <div className="space-y-4">
                {customerMessage(customer, mood)}
                <fieldset className="ml-24 min-w-0 rounded-2xl border border-stone-200 bg-white p-4">
                  <legend className="px-2 font-bold">Your response</legend>
                  <div className="space-y-3">
                    {options.map((option) => (
                    <button
                      key={option.answerId}
                      type="button"
                      onClick={() => choose(option.answerId)}
                      className="w-full rounded-xl border border-stone-200 p-3 text-left hover:border-[#287F6E] hover:bg-[var(--selection)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287F6E]"
                    >
                      {option.text}
                    </button>
                  ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default Learn;