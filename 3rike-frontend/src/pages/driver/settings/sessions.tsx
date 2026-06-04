import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Smartphone } from "lucide-react";
import MobileFrame from "@/components/ui/mobile-frame";
import Skeleton from "@/components/ui/skeleton";
import { ApiError, listSessions, revokeSession, type Session } from "@/lib/api";
import { getSession } from "@/lib/session";

export default function Sessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);
  const currentSessionId = getSession()?.sessionId ?? null;

  const load = async () => {
    setError(null);
    try {
      // Backend returns `null` (not `[]`) when there are no tracked sessions,
      // so normalize to an array before sorting.
      const data = (await listSessions()) ?? [];
      data.sort((a, b) => b.created_at.localeCompare(a.created_at));
      setSessions(data);
    } catch (err) {
      setError(err instanceof ApiError ? messageFor(err) : "Couldn't load sessions.");
      setSessions([]);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleRevoke = async (id: string) => {
    setRevoking(id);
    try {
      await revokeSession(id);
      setSessions((prev) => prev?.filter((s) => s.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? messageFor(err) : "Couldn't revoke session.");
    } finally {
      setRevoking(null);
    }
  };

  return (
    <MobileFrame innerClassName="px-5 py-6 flex flex-col">
      <header className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#E9F8EE] hover:bg-[#d8f1e0] cursor-pointer"
          type="button"
        >
          <ChevronLeft className="w-5 h-5 text-[#01C259]" />
        </Button>
        <h1 className="font-semibold text-lg text-gray-900">Active Sessions</h1>
      </header>

      <p className="text-xs text-[#909090] mb-6 px-1">
        Devices currently signed in to your account. Revoke any you don't recognize.
      </p>

      {sessions === null && (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3"
            >
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-40" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && sessions !== null && (
        <p className="text-sm text-red-500 text-center mb-4">{error}</p>
      )}

      {sessions !== null && sessions.length === 0 && !error && (
        <p className="text-sm text-[#909090] text-center mt-10">No active sessions.</p>
      )}

      {sessions !== null && sessions.length > 0 && (
        <div className="space-y-3">
          {sessions.map((s) => {
            const isCurrent = s.id === currentSessionId;
            return (
              <div
                key={s.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-[#F2FBF5] flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-[#01C259]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {isCurrent ? "This device" : "Other device"}
                    {isCurrent && (
                      <span className="ml-2 text-[10px] text-[#01C259] font-medium uppercase tracking-wider">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-[#909090]">
                    Signed in {formatRelative(s.created_at)} · expires {formatRelative(s.expires_at)}
                  </p>
                </div>
                {!isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleRevoke(s.id)}
                    disabled={revoking === s.id}
                    className="text-xs text-red-500 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer disabled:opacity-50"
                  >
                    {revoking === s.id ? "Revoking…" : "Revoke"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </MobileFrame>
  );
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const diffMs = date.getTime() - Date.now();
  const absSec = Math.abs(diffMs) / 1000;
  const sign = diffMs < 0 ? "ago" : "from now";
  if (absSec < 60) return `just ${sign === "ago" ? "now" : "now"}`;
  if (absSec < 3600) return `${Math.floor(absSec / 60)}m ${sign}`;
  if (absSec < 86400) return `${Math.floor(absSec / 3600)}h ${sign}`;
  return `${Math.floor(absSec / 86400)}d ${sign}`;
}

function messageFor(err: ApiError): string {
  if (err.code === "timeout") return "The server is waking up — please try again.";
  if (err.code === "network_error") return "Couldn't reach the server.";
  return "Something went wrong.";
}
