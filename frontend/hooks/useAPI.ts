import { useEffect, useState } from "react";
import { useAuthStore } from "./useAuthStore";
import { cacheData, loadCachedData } from "@/utils/cacheManager";

export function useApi<T = any>(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  append: boolean = false
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore().token;

  const effectiveCacheKey = cacheKey || url;

  useEffect(() => {
    console.log("useApi fetch:", url, "append:", append, "cache:", effectiveCacheKey);
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const cached = await loadCachedData<T>(effectiveCacheKey);
        if (cached && isMounted && !append) {
          setData(cached);
        }

        const res = await fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();

        if (isMounted) {
          setData(json);

          if (!append) {
            await cacheData(effectiveCacheKey, json);
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Unknown error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [url, JSON.stringify(options), token]);

  return { data, loading, error };
}
