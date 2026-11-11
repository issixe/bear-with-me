import { useCallback } from "react";
import { useServices } from "../context/ServicesContext";
import { useAsync } from "./useAsync";

export function useCurrentUser() {
  const { userService } = useServices();
  const load = useCallback(() => userService.getCurrentUser(), [userService]);
  const { data, loading, error } = useAsync(load);
  return { user: data, loading, error };
}