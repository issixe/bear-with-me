import { useCallback } from "react";
import { useServices } from "../context/ServicesContext";
import { useAsync } from "./useAsync";

export function useModules() {
  const { moduleService } = useServices();
  const load = useCallback(() => moduleService.list(), [moduleService]);
  const { data, loading, error } = useAsync(load);
  return { modules: data ?? [], loading, error };
}
