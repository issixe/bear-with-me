import { useCallback, useEffect, useState } from "react";
import { useServices } from "../context/ServicesContext";

export function useLeaderboard(topCount = 5) {
  const { leaderboardService } = useServices();
  const [result, setResult] = useState({
    requestKey: null,
    entries: [],
    loading: true,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);
  const requestKey = `${topCount}:${reloadToken}`;

  useEffect(() => {
    let cancelled = false;

    leaderboardService
      .getWeeklyLeaderboard(topCount)
      .then((entries) => {
        if (!cancelled) {
          setResult({ requestKey, entries, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({ requestKey, entries: [], loading: false, error });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [topCount, leaderboardService, requestKey]);

  const refetch = useCallback(() => {
    setReloadToken((n) => n + 1);
  }, []);

  return {
    entries: result.requestKey === requestKey ? result.entries : [],
    loading: result.requestKey !== requestKey || result.loading,
    error: result.requestKey === requestKey ? result.error : null,
    refetch,
  };
}
