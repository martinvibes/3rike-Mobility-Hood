import { useCallback, useEffect, useState } from "react";
import { ApiError, type Savings, getSavingsBalance } from "./api";
import { useAuth } from "./auth";

type State =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: Savings | null; error: null }
  | { status: "ready"; data: Savings; error: null }
  | { status: "error"; data: null; error: ApiError };

/**
 * Loads the current driver's savings balance and exposes a `refresh()` to
 * re-fetch (call this after deposits/withdrawals). Keeps last-known data
 * during a refresh so the UI doesn't flicker to a loading state.
 *
 * If the user has no driver profile yet, returns idle (no fetch).
 */
export function useSavings() {
  const { driver } = useAuth();
  const [state, setState] = useState<State>({ status: "idle", data: null, error: null });

  const refresh = useCallback(async () => {
    if (!driver) {
      setState({ status: "idle", data: null, error: null });
      return;
    }
    setState((prev) => ({
      status: "loading",
      data: prev.status === "ready" ? prev.data : null,
      error: null,
    }));
    try {
      const data = await getSavingsBalance(driver.id);
      setState({ status: "ready", data, error: null });
    } catch (err) {
      // Backend returns 404 for a driver who's never deposited. Treat as "0
      // balance" rather than an error so the UI reads $0.00 cleanly.
      if (err instanceof ApiError && err.status === 404) {
        setState({
          status: "ready",
          data: {
            id: 0,
            driver_id: driver.id,
            balance_usdc: 0,
            created_at: new Date().toISOString(),
          },
          error: null,
        });
        return;
      }
      setState({
        status: "error",
        data: null,
        error: err instanceof ApiError ? err : new ApiError(0, "unknown"),
      });
    }
  }, [driver]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    balance: state.data?.balance_usdc ?? 0,
    isLoading: state.status === "loading" && state.data === null,
    isReady: state.status === "ready",
    error: state.error,
    refresh,
  };
}
