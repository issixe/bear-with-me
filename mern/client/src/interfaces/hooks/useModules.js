import { useCallback } from "react";
import { useServices } from "../context/ServicesContext";

export function useModules() {
  const { moduleService } = useServices();
  const load = useCallback(() => moduleService.getAllWithLessons(), [moduleService]);
  const { data, loading, error } = useAsync(load);
  return { modules: data ?? [], loading, error };
}