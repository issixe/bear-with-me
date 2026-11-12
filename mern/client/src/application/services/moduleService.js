import { apiClient } from "../../infrastructure/http/apiClient";

export const moduleService = {
  list: async () => (await apiClient.get("/modules")).modules,
};
