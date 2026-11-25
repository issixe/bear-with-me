import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../context/ServicesContext";

export function useStartSession() {
  const { sessionService } = useServices();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

  const start = useCallback(
    async (userId, lessonId) => {
      setStarting(true);
      setError(null);
      try {
        return await sessionService.start({ userId, lessonId });
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

export function useOpenLesson(userId) {
  const navigate = useNavigate();
  const { start, starting, error } = useStartSession();

  const openLesson = useCallback(
    async (lessonId) => {
      try {
        const session = await start(userId, lessonId);
        navigate(`/learn?lesson=${encodeURIComponent(lessonId)}`, {
          state: { session },
        });
      } catch {
        // error is already stored by useStartSession
      }
    },
    [userId, start, navigate],
  );

  return { openLesson, opening: starting, error };
}
