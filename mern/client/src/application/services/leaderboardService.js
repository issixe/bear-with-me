import { apiClient } from "../../infrastructure/http/apiClient";

export const leaderboardService = {
  getWeeklyLeaderboard: async (topCount = 5) => {
    const query =
      topCount !== undefined && topCount !== null
        ? `?topCount=${encodeURIComponent(topCount)}`
        : "";
    const entries = (await apiClient.get(`/leaderboard${query}`)).leaderboard ?? [];

    return entries.map(([userId, username, totalPoints], index) => ({
      rank: index + 1,
      userId,
      username: username ?? "Unknown Agent",
      totalPoints: totalPoints ?? 0,
    }));
  },
};