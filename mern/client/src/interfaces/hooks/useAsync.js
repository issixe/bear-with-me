import { useEffect, useState } from "react";
export function useAsync(load) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    let active = true;
    load().then(
      data => { if (active) setState({ data, loading: false, error: null }); },
      error => { if (active) setState({ data: null, loading: false, error }); },
    );
    return () => { active = false; };
  }, [load]);
  return state;
}
