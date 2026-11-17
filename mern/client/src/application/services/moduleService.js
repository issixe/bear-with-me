import { apiClient } from "../../infrastructure/http/apiClient";
export const moduleService = {
  async getAllWithLessons() {
    const { modules } = await apiClient.get("/modules");
    return Promise.all(modules.map(async module => {
      const { lessons } = await apiClient.get(`/modules/${encodeURIComponent(module.id)}/lessons`);
      return { ...module, lessons };
    }));
  },
};
