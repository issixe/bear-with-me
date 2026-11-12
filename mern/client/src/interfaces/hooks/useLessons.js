import { useEffect, useState } from "react";
import { useServices } from "../context/ServicesContext";

export function useLessons(moduleId) {
  const { lessonService } = useServices();
  const [lessons, setLessons] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!moduleId) return; // dropdown closed: don't fetch
    let cancelled = false;
    lessonService
      .listByModule(moduleId)
      .then((data) => {
        if (!cancelled) {
          setLessons(data);
          setError(null);
        }
      })

      .catch((err) => {
        if (!cancelled) setError(err);
      });
    return () => {
      cancelled = true;
    };
  }, [moduleId, lessonService]);

  return {
    lessons: lessons ?? [],
    loading: !!moduleId && lessons === null && !error,
    error,
  };
}
