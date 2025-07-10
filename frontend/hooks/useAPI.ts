import { useEffect, useState } from "react";
import { useAuthStore } from "./useAuthStore";

export function useApi<T = any>(url: string, options: RequestInit = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore().token;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err: any) {
        if (isMounted) setError(err.message || "Unknown error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
