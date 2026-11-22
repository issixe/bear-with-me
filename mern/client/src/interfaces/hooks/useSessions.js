import { useCallback, useState } from "react";
import { useServices } from "../context/ServicesContext";

export function useStartSession() {
  const { sessionService } = useServices();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

  const start = useCallback(
    async (agentId, lessonId) => {
      setStarting(true);
      setError(null);
      try {
        return await sessionService.start({ agentId, lessonId });
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setStarting(false);
      }
    },
    [sessionService],
  );

  return { start, starting, error };
}
