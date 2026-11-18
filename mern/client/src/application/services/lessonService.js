import { apiClient } from "../../infrastructure/http/apiClient";

export const lessonService = {
  listByModule: async (moduleId) =>
    (await apiClient.get(`/modules/${encodeURIComponent(moduleId)}/lessons`))
      .lessons,
};
