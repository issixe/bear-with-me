// Mock for now
export const userService = {
  getCurrentUser: async () => ({
    name: "friend",
    streak: 0,
    completedLessonIds: [],
  }),
};
