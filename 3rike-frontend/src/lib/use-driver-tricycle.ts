// useDriverTricycle: locates the tricycle assigned to the current driver.
//
// The backend has no /api/drivers/{id}/tricycle endpoint, so we list all
// tricycles and filter client-side. Returns null when the driver hasn't been
// assigned one yet.

import { useCallback, useEffect, useState } from "react";
import { ApiError, listTricycles, type Tricycle } from "./api";
import { useAuth } from "./auth";

export function useDriverTricycle() {
  const { driver } = useAuth();
  const [tricycle, setTricycle] = useState<Tricycle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const refresh = useCallback(async () => {
    if (!driver) {
      setTricycle(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const all = await listTricycles();
      const mine = all.find((t) => t.driver_id === driver.id) ?? null;
      setTricycle(mine);
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(0, "unknown"));
    } finally {
      setLoading(false);
    }
  }, [driver]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { tricycle, loading, error, refresh };
}
