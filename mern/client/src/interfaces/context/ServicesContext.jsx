import { createContext, useContext } from "react";
import { moduleService } from "../../application/services/moduleService";
const services = { moduleService };
const ServicesContext = createContext(null);
export function ServicesProvider({ children }) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useServices() {
  const value = useContext(ServicesContext);
  if (!value) throw new Error("ServicesProvider is required");
  return value;
}
