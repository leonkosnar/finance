import { useAuthStore } from "./useAuthStore";

export function useApiMutation() {
  const token = useAuthStore().token;

  const mutate = async <T = any>(
    url: string,
    method: "POST" | "PUT" | "DELETE",
    body?: any
  ): Promise<{ data: T | null; error: string | null }> => {
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        return { data: null, error: `Fehler: ${res.status}` };
      }

      const contentType = res.headers.get("Content-Type");
      const isJson = contentType?.includes("application/json");
      const data = isJson ? await res.json() : null;

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || "Unbekannter Fehler" };
    }
  };

  return { mutate };
}
