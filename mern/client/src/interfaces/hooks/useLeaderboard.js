import { useEffect, useState } from "react";
import { useServices } from "../context/ServicesContext";

export function useLeaderboard(topCount = 5) {
  const { leaderboardService } = useServices();
  const [result, setResult] = useState({
    entries: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    leaderboardService
      .getWeeklyLeaderboard(topCount)
      .then((entries) => {
        if (!cancelled) {
          setResult({ entries, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({ entries: [], loading: false, error });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [leaderboardService, topCount]);

  return result;
}
