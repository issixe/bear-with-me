import pipWave from "../../assets/pip/waving.png";
import ModuleItem from "../components/home/ModuleItem";
import StreakBadge from "../components/home/StreakBadge";
import { useModules } from "../hooks/useModules";
import { useCurrentUser } from "../hooks/useUsers";

export default function Home() {
  const { user } = useCurrentUser();
  const {
    modules,
    loading: modulesLoading,
    error: modulesError,
  } = useModules();

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

      <section aria-labelledby="modules-heading">
        <h2
          id="modules-heading"
          className="mb-4 text-3xl font-extrabold text-[#24413B]"
        >
          Modules
        </h2>
        {modulesLoading && <p className="text-stone-500">Loading modules...</p>}
        {modulesError && (
          <p role="alert" className="text-red-700">
            Couldn't load modules. Check that the server is running and refresh.
          </p>
        )}

        {!modulesLoading && !modulesError && (
          <div className="flex flex-col gap-3">
            {modules.map((m) => (
              <ModuleItem
                key={m.id}
                module={m}
                completedLessonIds={user?.completedLessonIds}
                agentId={user?.id}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
