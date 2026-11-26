import { Link } from "react-router-dom";
import pipCelebrate from "../../assets/pip/celebrate.png";
import streakIcon from "../../assets/streakIcon.png";

const streakDays = 3;
const totalDays = 7;

//Lesson passed these in when it was completed
export default function ModuleComplete({
  lessonTitle,
  moduleTitle,
  onContinue,
  opening = false,
  scores = [],
  cScore = 0,
}) {
  //To display the satisfaction score
  const satisfaction = Math.round(
    scores.length
      ? scores.reduce((total, score) => total + score, 0) / scores.length
      : 0,
  );

  //Streak, pip's messages are hardcoded.
  return (
    <section className="relative min-w-0 flex-1 bg-[var(--background)] p-8">
      <div className="absolute right-4 top-3 flex items-center gap-2 font-bold text-[#9b5325]">
        <img src={streakIcon} alt="" className="size-5" />
        <span>{streakDays}</span>
      </div>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <p className="font-bold text-[#287F6E]">Pip’s proud of you!</p>
          <img src={pipCelebrate} alt="" className="size-32 object-contain" />
          <h1 className="text-3xl font-bold">Lesson complete!</h1>
          <p className="text-stone-600">
            {[moduleTitle, lessonTitle].filter(Boolean).join(" · ")}
          </p>
          <div className="rounded-2xl bg-white p-4">
            <p className="font-bold">Customer satisfaction</p>
            <p className="text-2xl font-bold">{cScore.toFixed(0)} points</p>
            <p>Average answer score: {satisfaction}%</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl bg-[var(--streak-light)] p-4">
            <h2 className="font-bold">{streakDays}-day streak maintained!</h2>
            <div className="mt-2 flex gap-2">
              {Array.from({ length: totalDays }, (_, index) => {
                const day = index + 1;
                return day <= streakDays ? (
                  <span
                    key={`day-${day}`}
                    className="grid size-7 place-items-center rounded-full bg-[#9b5325] font-bold text-white"
                  >
                    ✓
                  </span>
                ) : (
                  <span
                    key={`day-${day}`}
                    className="size-7 rounded-full border-2 border-[#9b5325]"
                  ></span>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <h2 className="font-bold">Remember</h2>
            <p className="text-stone-600">
              Acknowledge the customer’s concern, without disregarding their
              emotion.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 text-center">
          {onContinue ? (
            <button
              type="button"
              onClick={onContinue}
              disabled={opening}
              className="rounded-xl bg-[#267a6b] p-3 font-bold text-white"
            >
              {opening ? "Opening..." : "Continue learning →"}
            </button>
          ) : (
            <Link
              to="/"
              className="rounded-xl bg-[#267a6b] p-3 font-bold text-white"
            >
              Back to homepage
            </Link>
          )}
          {onContinue && (
            <Link to="/" className="font-bold hover:underline">
              Back to homepage
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
