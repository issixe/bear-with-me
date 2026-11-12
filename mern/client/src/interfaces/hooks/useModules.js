import { useEffect, useState } from "react";
import { useServices } from "../context/ServicesContext";

export function useModules() {
  const { moduleService } = useServices();
  const [modules, setModules] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    moduleService
      .list()
      .then((data) => {
        if (!cancelled) setModules(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });
    return () => {
      cancelled = true;
    };
  }, [moduleService]);

  return { modules: modules ?? [], loading: modules === null && !error, error };
}
