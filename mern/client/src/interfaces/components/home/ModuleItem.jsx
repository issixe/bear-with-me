import { useState } from "react";
import { Link } from "react-router-dom";
import { useLessons } from "../../hooks/useLessons";

export default function ModuleItem({ module, completedLessonIds = [] }) {
  const [open, setOpen] = useState(false);
  
  // Only fetch lessons (listLessons) once the module is opened
  const { lessons, loading, error } = useLessons(open ? module.id : null);
  const panelId = `module-${module.id}-lessons`;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <span>
          <span className="block text-xl font-bold text-[#24413B]">{module.title}</span>
          {module.description && (
            <span className="block text-stone-600">{module.description}</span>
          )}
        </span>
        <span
          aria-hidden="true"
          className={`text-2xl text-[#24413B] transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div id={panelId} className="border-t border-stone-200 px-6 py-4">
          {loading && <p className="text-stone-500">Loading lessons...</p>}

          {error && (
            <p role="alert" className="text-red-700">
              Couldn't load lessons for this module.
            </p>
          )}

          {!loading && !error && lessons.length === 0 && (
            <p className="text-stone-500">No lessons in this module yet.</p>
          )}

          {!loading && !error && lessons.length > 0 && (
            <ul className="flex flex-col gap-2">
              {lessons.map((lesson) => {
                const done = completedLessonIds.includes(lesson.id);
                return (
                  <li key={lesson.id}>
                    <Link
                      to={`/learn?lessonId=${encodeURIComponent(lesson.id)}`}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-[#24413B] hover:bg-[var(--selection)] hover:text-[var(--selection-text)]"
                    >
                      <span>{lesson.title}</span>
                      {done && (
                        <span className="text-sm font-semibold text-[var(--selection-text)]">
                          ✓ Done
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
