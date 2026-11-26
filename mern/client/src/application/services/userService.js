import { apiClient } from "../../infrastructure/http/apiClient";

const userId = import.meta.env.VITE_USER_ID;
const userName = import.meta.env.VITE_USER_NAME;

export const userService = {
  async getCurrentUser() {
    if (!userId) {
      throw new Error("VITE_USER_ID is not set in the environment variables");
    }

    const progress = await apiClient.get(
      `/users/${encodeURIComponent(userId)}/progress`
    );

    return {
      id: progress.userId,
      name: userName,
      streak: progress.streak ?? 0,
      totalPoints: progress.totalPoints ?? 0,
      completedLessonIds: progress.completedLessonIds ?? [],
    };
  },
};
  