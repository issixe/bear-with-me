import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { exampleModules, exampleLessons } from "../../../../server/src/database/seeds/seedData.js";
import pip from "../../assets/pip/thumbs-up.png";

const Learn = () => {
  const [params] = useSearchParams();
  const id = params.get("lesson") ?? "double_billing";
  const lesson = exampleLessons.find((item) => item.lesson_id === id);

  if (!lesson) {
    return <main className="p-6">Lesson not found. <Link to="/" className="underline">Back home</Link></main>;
  }

  return <Lesson key={id} lesson={lesson} />;
};

function Lesson({ lesson }) {
  const module = exampleModules.find((item) => item.lessons.includes(lesson.lesson_id));
  const [stageId, setStageId] = useState(lesson.starting_stage);
  const [tension, setTension] = useState(70);
  const [history, setHistory] = useState([]);
  const [complete, setComplete] = useState(false);
  const latest = useRef(null);
  const stage = lesson.stages[stageId];
  const mood = tension > 65 ? "angry" : tension > 35 ? "frustrated" : "calm";
  const customer = stage["customer responses"][mood];
  const progress = Math.round(history.length / Object.keys(lesson.stages).length * 100);

  useEffect(() => {
    if (history.length) latest.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [history.length]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function choose(answer) {
    const score = Object.values(answer.scores).reduce((sum, value) => sum + value, 0) / Object.keys(answer.scores).length;
    setHistory([...history, { stageId, customer, mood, answer: answer.text }]);
    setTension(Math.max(0, Math.min(100, tension + (score >= 75 ? -25 : score >= 40 ? 5 : 20))));
    if (stage.next_stage === null) setComplete(true);
    else setStageId(stage.next_stage);
  }

  function speak(text) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }

  function customerMessage(text, customerMood) {
    return (
      <div className="flex items-start gap-3">
        <span className="text-3xl" role="img" aria-label={`${customerMood} customer`}>
          {customerMood === "angry" ? "😠" : customerMood === "frustrated" ? "😐" : "🙂"}
        </span>
        <div className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-white p-4">
          <p className="mb-2 text-sm font-bold">Customer</p>
          <p>{text}</p>
        </div>
        {"speechSynthesis" in window && (
          <button type="button" onClick={() => speak(text)} aria-label="Read customer message aloud" className="rounded-full border border-stone-300 p-2 hover:bg-white">🔊</button>
        )}
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl text-[#24413B] md:flex">
      <aside className="border-b border-stone-200 bg-white p-4 md:w-56 md:shrink-0 md:border-r md:border-b-0">
        <Link to="/" className="font-bold hover:underline">← My Progress</Link>
        <p className="mt-6 mb-3 font-bold">{module?.title}</p>
        <nav aria-label="Module lessons" className="flex gap-2 overflow-x-auto md:flex-col">
          {module?.lessons.map((id) => (
            <Link key={id} to={`/learn?lesson=${id}`} aria-current={id === lesson.lesson_id ? "page" : undefined}
              className={`min-w-40 rounded-lg p-3 text-sm md:min-w-0 ${id === lesson.lesson_id ? "bg-[var(--selection)] font-bold text-[var(--selection-text)]" : "hover:bg-stone-100"}`}>
              {exampleLessons.find((item) => item.lesson_id === id)?.title}
            </Link>
          ))}
        </nav>
        <img src={pip} alt="Pip cheering you on" className="mx-auto mt-8 hidden w-32 md:block" />
      </aside>

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

        <div className="space-y-6 p-4 md:p-6">
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
            {complete ? (
              <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
                <h2 className="text-2xl font-bold">Lesson complete!</h2>
                <p className="my-3">You finished all {history.length} stages. Final customer tension: {tension}%.</p>
                <p className="mb-4 text-sm text-stone-500">This is a sample lesson. Progress is not saved yet.</p>
                <Link to="/" className="inline-block rounded-lg bg-[#287F6E] px-4 py-2 text-white">Back to modules</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {customerMessage(customer, mood)}
                <fieldset className="ml-8 min-w-0 rounded-2xl border border-stone-200 bg-white p-4 md:ml-24">
                  <legend className="px-2 font-bold">Your response</legend>
                  <div className="space-y-3">
                    {Object.entries(stage.answers).map(([id, answer]) => (
                      <button key={id} type="button" onClick={() => choose(answer)} className="w-full rounded-xl border border-stone-200 p-3 text-left hover:border-[#287F6E] hover:bg-[var(--selection)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287F6E]">
                        {answer.text}
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
