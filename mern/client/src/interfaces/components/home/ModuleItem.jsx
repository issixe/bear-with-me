import { Link } from "react-router-dom";

export default function ModuleItem({ module, completedLessonIds = [] }) {
  return (
    <details className="rounded-xl border border-stone-200 bg-white p-4">
      <summary className="cursor-pointer font-bold text-[#24413B]">{module.title}</summary>
      <p className="my-3 text-stone-600">{module.description}</p>
      <ul className="space-y-2">
        {module.lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link to={`/learn?lesson=${encodeURIComponent(lesson.id)}`} className="block rounded-lg bg-[var(--selection)] p-3 text-[var(--selection-text)] hover:underline">
              {lesson.title}
              {completedLessonIds.includes(lesson.id) && (
                <span className="ml-2 text-sm font-bold">Completed</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
