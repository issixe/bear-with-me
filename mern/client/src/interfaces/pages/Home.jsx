import { useModules } from "../hooks/useModules";
import { useCurrentUser } from "../hooks/useUsers";
import ModuleItem from "../components/home/ModuleItem";
import StreakBadge from "../components/home/StreakBadge";
import pipWave from "../../assets/pip/waving.png";

export default function Home() {
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const { modules, loading: modulesLoading, error: modulesError } = useModules();

  return (
    <main className="mx-auto max-w-5xl">
      <header className="relative flex items-center gap-8 py-6">
        <img src={pipWave} alt="Pip the bear waving" className="h-40 w-auto" />
        <h1 className="text-5xl font-extrabold text-[#24413B]">
          Welcome back, {user?.name ?? "friend"}!
        </h1>
        {user && (
          <div className="absolute right-0 top-0">
            <StreakBadge count={user.streak} />
          </div>
        )}
      </header>

      <section>
        <h2 id="modules-heading" className="mb-4 text-3xl font-extrabold text-[#24413B]">
          Modules
        </h2>
        {(userLoading || modulesLoading) && <p className="text-stone-500">Loading modules...</p>}
        {(userError || modulesError) && (
          <p role="alert" className="text-red-700">
            Couldn't load modules. Check that the server is running and refresh.
          </p>
        )}

        {user && !modulesLoading && !modulesError && (
          <div className="flex flex-col gap-3">
            {modules.map((m) => (
              <ModuleItem key={m.id} module={m} completedLessonIds={user.completedLessonIds} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}