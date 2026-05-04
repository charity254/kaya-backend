const BASE_URL = "https://kaya-xb37.onrender.com";

export const getToken = (): string | null => localStorage.getItem("kaya_token");
export const setToken = (token: string): void => localStorage.setItem("kaya_token", token);
export const clearAuth = (): void => {
  localStorage.removeItem("kaya_token");
  localStorage.removeItem("kaya_user");
};

async function apiFetch<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const apiGet = <T>(path: string): Promise<T> => apiFetch<T>("GET", path);
export const apiPost = <T>(path: string, body: unknown): Promise<T> =>
  apiFetch<T>("POST", path, body);
