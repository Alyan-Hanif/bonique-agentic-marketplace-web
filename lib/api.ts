const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  error?: string;
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: options.signal ?? AbortSignal.timeout(12000),
      cache:
        options.cache ??
        (options.method && options.method !== "GET" ? "no-store" : "default"),
    });
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      throw new ApiError("Request timed out. Please try again.", 408);
    }
    throw err;
  }

  let body: ApiEnvelope<T> | null = null;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError(
      `Invalid JSON response from API (${res.status})`,
      res.status
    );
  }

  if (!res.ok || body.success === false) {
    throw new ApiError(
      body.message || body.error || `Request failed (${res.status})`,
      body.statusCode || res.status
    );
  }

  return body.data;
}

export { API_BASE };
