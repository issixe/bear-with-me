import { useState } from "react";
import streakIcon from "../../assets/streakIcon.png";
import { LeaderboardCard } from "../components/home/LeaderboardCard";

const sampleEmployees = [
  { name: "Edward", streak: 5, avatarColor: "bg-[#e6daf8]" },
  { name: "Steve", streak: 3, avatarColor: "bg-[#f6dc9a]" },
  { name: "Dave", streak: 3, avatarColor: "bg-[#c5dfb3]" },
  { name: "Amber", streak: 4, avatarColor: "bg-[#bcd9ee]" },
  { name: "Kim", streak: 3, avatarColor: "bg-[#bcd9ee]" },
  { name: "Ove", streak: 8, avatarColor: "bg-[#efd1b8]" },
  { name: "Kate", streak: 2, avatarColor: "bg-[#efd1b8]" },
  { name: "Dorian", streak: 1, avatarColor: "bg-[#e6daf8]" },
];

const tabs = ["Homepage", "Settings", "Profile"];

const fileInputs = [
  { id: "custom-lesson", label: "Submit custom lesson" },
  { id: "past-conversations", label: "Upload past conversations" },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("Homepage");
  const isHomepage = activeTab === "Homepage";

  return (
    <main className="flex min-h-dvh w-full text-[#24413B]">
      <aside className="sticky top-0 min-h-dvh w-48 shrink-0 self-start border-r border-stone-200 bg-white p-4">
        <nav className="flex flex-col gap-2">
          {tabs.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveTab(label)}
              className={`rounded-lg px-3 py-2 text-left ${
                activeTab === label
                  ? "bg-[var(--selection)] font-bold text-[var(--selection-text)]"
                  : "hover:bg-[var(--selection)]"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 bg-[var(--background)]">
        <div className="mx-auto max-w-3xl px-10 py-8">
          <h1 className="mb-8 text-3xl font-extrabold">Admin Page</h1>
          <div
            className={
              isHomepage
                ? "grid items-start gap-6 grid-cols-[minmax(0,1fr)_220px]"
                : "hidden"
            }
          >
            <section id="employee-overview">
              <h2 className="mb-3 text-xl font-extrabold">Employee Overview</h2>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                {sampleEmployees.map(({ name, streak, avatarColor }) => (
                  <li
                    key={name}
                    className="flex items-center gap-2 text-sm text-[#242824]"
                  >
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold text-[#24413B] ${avatarColor}`}
                    >
                      {name[0]}
                    </span>
                    <span
                      className="flex items-center gap-0.5 font-bold text-[var(--streak-dark)]"
                      title={`${streak}-day streak`}
                    >
                      <img
                        src={streakIcon}
                        alt=""
                        className="size-4 object-contain"
                      />
                      {streak}
                    </span>
                    {name}
                  </li>
                ))}
              </ul>
            </section>

            <LeaderboardCard title="Leaderboard" topCount={5} />
          </div>

          <section
            id="custom-lesson"
            hidden={!isHomepage}
            className="mt-14 space-y-4"
          >
            <h2 className="text-xl font-extrabold">Add Custom Lesson</h2>
            {fileInputs.map(({ id, label }) => (
              <label
                key={id}
                className="flex min-h-16 flex-wrap items-center justify-between gap-3 rounded-lg border border-[#ccd5ce] bg-[var(--selection)] px-3 py-3 text-[#242824]"
              >
                <span className="text-xl">{label}</span>
                <input
                  type="file"
                  className="ml-auto block w-60 max-w-full cursor-pointer text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:bg-white file:px-3 file:py-2 file:font-semibold"
                />
              </label>
            ))}
            <details className="group rounded-lg border border-[#ccd5ce] bg-[var(--selection)] text-[#242824]">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-xl">
                Returned worst conversations
                <span className="mr-1 size-2.5 shrink-0 rotate-45 border-b-2 border-r-2 group-open:rotate-[225deg]" />
              </summary>
              <p className="px-3 pb-3 text-sm text-stone-600">
                No results available yet.
              </p>
            </details>
          </section>
          {!isHomepage && (
            <section>
              <h2 className="text-xl font-extrabold">Coming soon</h2>
              <p className="mt-2 text-sm text-stone-600">
                No details available yet.
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
