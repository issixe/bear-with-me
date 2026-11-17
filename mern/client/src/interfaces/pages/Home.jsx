import { useModules } from "../hooks/useModules";
import ModuleItem from "../components/home/ModuleItem";
import pipWave from "../../assets/pip/waving.png";

export default function Home() {
  const { modules, loading, error } = useModules();

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
        <p className="mb-4 text-stone-500">Lessons loaded from the server. Progress is not saved yet.</p>

        {loading && <p>Loading modules...</p>}
        {error && <p role="alert">Could not load modules. Check the server connection and refresh.</p>}
        {!loading && !error && modules.length === 0 && <p>No modules available yet.</p>}
        <div className="flex flex-col gap-3">
          {modules.map((m) => (
            <ModuleItem key={m.id} module={m} />
          ))}
        </div>
      </section>
    </main>
  )
}
