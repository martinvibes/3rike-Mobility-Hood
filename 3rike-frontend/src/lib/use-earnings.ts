import { useCallback, useEffect, useState } from "react";
import { ApiError, listYieldPayouts } from "./api";
import { useAuth } from "./auth";

/**
 * Sums the user's lifetime yield payouts. Returns 0 when the user doesn't
 * have an investor profile yet (i.e. hasn't invested).
 */
export function useEarnings() {
  const { investor } = useAuth();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const refresh = useCallback(async () => {
    if (!investor) {
      setTotal(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payouts = await listYieldPayouts(investor.id);
      setTotal(payouts.reduce((sum, p) => sum + p.amount_usdc, 0));
    } catch (err) {
      // 404 = no payouts yet — treat as 0.
      if (err instanceof ApiError && err.status === 404) {
        setTotal(0);
        return;
      }
      setError(err instanceof ApiError ? err : new ApiError(0, "unknown"));
    } finally {
      setLoading(false);
    }
  }, [investor]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { total, loading, error, refresh };
}
