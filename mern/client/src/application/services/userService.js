// Mock for now
export const userService = {
  getCurrentUser: async () => ({
    id: "dev-user",
    name: "friend",
    streak: 0,
    completedLessonIds: [],
  }),
};
