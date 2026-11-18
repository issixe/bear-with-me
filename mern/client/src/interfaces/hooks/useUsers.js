import { useEffect, useState } from "react";
import { useServices } from "../context/ServicesContext";

export function useCurrentUser() {
  const { userService } = useServices();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    userService
      .getCurrentUser()
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });
    return () => {
      cancelled = true;
    };
  }, [userService]);

  return { user, loading: user === null && !error, error };
}
