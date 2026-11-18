import { createContext, useContext, useMemo } from "react";
import { moduleService } from "../../application/services/moduleService";
import { lessonService } from "../../application/services/lessonService";
import { userService } from "../../application/services/userService";

const ServicesContext = createContext(null);

export function ServicesProvider({ children }) {
  const services = useMemo(() => ({ moduleService, lessonService, userService }), []);
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices() {
  const services = useContext(ServicesContext);
  if (!services) throw new Error("useServices must be used inside <ServicesProvider>");
  return services;
}
