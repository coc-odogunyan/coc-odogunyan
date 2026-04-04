// ─────────────────────────────────────────────────────────────
// Central API gateway — all Edge Function requests go through here.
// ─────────────────────────────────────────────────────────────

const BASE_URL  = import.meta.env.VITE_API_URL as string;
const ANON_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!BASE_URL)  console.warn('[api] VITE_API_URL is not set. Add it to your .env file.');
if (!ANON_KEY)  console.warn('[api] VITE_SUPABASE_ANON_KEY is not set. Add it to your .env file.');

// ── Error class ───────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Query param helper ────────────────────────────────────────

type Params = Record<string, string | number | boolean | undefined | null>;

function buildUrl(path: string, params?: Params): string {
  const url = new URL(`${BASE_URL}/${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

// ── Core request function ─────────────────────────────────────

export async function request<T>(
  path: string,
  options: RequestInit & { params?: Params } = {},
): Promise<T> {
  const { params, ...init } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };

  // Supabase gateway requires the anon key to identify the project
  if (ANON_KEY) headers['apikey'] = ANON_KEY;

  // Attach the user's JWT when logged in
  const token = sessionStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, params), { ...init, headers });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }));
    throw new ApiError(body.error ?? response.statusText, response.status);
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// ── Convenience methods ───────────────────────────────────────

export const api = {
  get<T>(path: string, params?: Params) {
    return request<T>(path, { method: 'GET', params });
  },
  post<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'POST', body: JSON.stringify(body) });
  },
  patch<T>(path: string, params: Params, body: unknown) {
    return request<T>(path, { method: 'PATCH', params, body: JSON.stringify(body) });
  },
  delete<T>(path: string, params: Params) {
    return request<T>(path, { method: 'DELETE', params });
  },
};
