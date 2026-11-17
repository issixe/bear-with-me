import { exampleModules, exampleLessons } from "../../../../server/src/database/seeds/seedData.js";
import ModuleItem from "../components/home/ModuleItem";
import pipWave from "../../assets/pip/waving.png";

export default function Home() {
  const modules = exampleModules.map((module) => ({
    id: module.module_id,
    title: module.title,
    description: module.description,
    lessons: module.lessons.map((id) => ({
      id,
      title: exampleLessons.find((lesson) => lesson.lesson_id === id)?.title,
    })),
  }));

  return (
    <main className="mx-auto max-w-5xl">
      <header className="relative flex items-center gap-8 py-6">
        <img src={pipWave} alt="Pip the bear waving" className="h-40 w-auto" />
        <h1 className="text-5xl font-extrabold text-[#24413B]">
          Welcome back, friend!
        </h1>
      </header>

      <section>
        <h2 id="modules-heading" className="mb-4 text-3xl font-extrabold text-[#24413B]">
          Modules
        </h2>
        <p className="mb-4 text-stone-500">Sample lessons. Progress is not saved yet.</p>

        <div className="flex flex-col gap-3">
          {modules.map((m) => (
            <ModuleItem key={m.id} module={m} />
          ))}
        </div>
      </section>
    </main>
  )
}
