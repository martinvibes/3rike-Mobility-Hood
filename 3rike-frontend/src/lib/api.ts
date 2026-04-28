// API client for the 3rike backend. Reads VITE_API_URL from env, defaults to
// the local dev server. All functions throw a typed ApiError on non-2xx so
// callers can surface the backend `error` code (e.g. "invalid_email") to the
// user.

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message?: string) {
    super(message ?? code);
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new ApiError(res.status, data?.error ?? "request_failed");
  }
  return data as T;
}

// --- Waitlist ---

export type WaitlistEntry = {
  id: number;
  email: string;
  phone?: string;
  referral_code: string;
  referred_by?: string;
  position: number;
  created_at: string;
};

export type JoinResponse = {
  entry: WaitlistEntry;
  totalCount: number;
};

export type StatsResponse = {
  totalCount: number;
};

export type GetByCodeResponse = {
  entry: WaitlistEntry;
  totalCount: number;
  referralCount: number;
};

export function joinWaitlist(payload: {
  email: string;
  phone?: string;
  referredBy?: string;
}): Promise<JoinResponse> {
  return request<JoinResponse>("/waitlist/join", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getWaitlistStats(): Promise<StatsResponse> {
  return request<StatsResponse>("/waitlist/stats");
}

export function getWaitlistEntry(code: string): Promise<GetByCodeResponse> {
  return request<GetByCodeResponse>(`/waitlist/${encodeURIComponent(code)}`);
}
