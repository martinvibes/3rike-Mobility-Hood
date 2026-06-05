import { useCallback, useEffect, useState } from "react";
import { ApiError, getPortfolio } from "./api";

/**
 * The user's currently-claimable investment yield (real, read on-chain from
 * their fractional holdings). Returns 0 when they haven't invested yet.
 */
export function useEarnings() {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const portfolio = await getPortfolio();
      setTotal(Number(portfolio.totals.pendingYieldUsdc) || 0);
    } catch (err) {
      // 404 / no holdings yet — treat as 0.
      if (err instanceof ApiError && err.status === 404) {
        setTotal(0);
        return;
      }
      setError(err instanceof ApiError ? err : new ApiError(0, "unknown"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { total, loading, error, refresh };
}
