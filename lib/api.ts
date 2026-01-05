// lib/api.ts
export const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");

type AnyObj = Record<string, any>;

async function readError(res: Response) {
  try {
    const data = (await res.json()) as AnyObj;
    return data?.detail || data?.message || `Error ${res.status}`;
  } catch {
    return `Error ${res.status}`;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE) throw new Error("Falta NEXT_PUBLIC_API_BASE en .env.local");

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as T;
}
