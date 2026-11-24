import { useCallback, useState } from "react";
import { useServices } from "../context/ServicesContext";
import { useNavigate } from "react-router-dom";

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

export function useOpenLesson(agentId) {
  const navigate = useNavigate();
  const { start, starting, error } = useStartSession();

  const openLesson = useCallback(
    async (lessonId) => {
      try {
        const session = await start(agentId, lessonId);
        navigate(`/learn?lesson=${encodeURIComponent(lessonId)}`, {
          state: { session },
        });
      } catch {
        // error is already stored by useStartSession
      }
    },
    [agentId, start, navigate],
  );

  return { openLesson, opening: starting, error };
}
