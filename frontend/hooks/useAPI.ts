import { useEffect, useState, useCallback } from "react";
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const cached = await loadCachedData<T>(effectiveCacheKey);
      if (cached && !append) {
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

      setData(json);

      if (!append) {
        await cacheData(effectiveCacheKey, json);
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options), token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [fetchData, token]);

  return { data, loading, error, refetch: fetchData };
}
