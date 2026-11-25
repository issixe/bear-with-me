import { useCallback, useEffect, useState } from "react";
import { useServices } from "../context/ServicesContext";

export function useLeaderboard(topCount = 5) {
  const { leaderboardService } = useServices();
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setEntries(null);
    setError(null);

    leaderboardService
      .getWeeklyLeaderboard(topCount)
      .then((data) => {
        if (!cancelled) {
          setEntries(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [topCount, leaderboardService, reloadToken]);

  const refetch = useCallback(() => {
    setReloadToken((n) => n + 1);
  }, []);

  return {
    entries: entries ?? [],
    loading: entries === null && !error,
    error,
    refetch,
  };
}