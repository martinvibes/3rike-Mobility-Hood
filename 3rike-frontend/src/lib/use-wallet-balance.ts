// Fetches the current user's Canton wallet balance. Returns null when the
// user hasn't linked a wallet yet (no fetch happens). The Canton API is
// network-bound and can be slow on cold starts, so callers should expose a
// loading state.

import { useCallback, useEffect, useState } from "react";
import { ApiError, getWalletBalance, type WalletBalance } from "./api";
import { useAuth } from "./auth";

type State = {
  balance: WalletBalance | null;
  loading: boolean;
  error: ApiError | null;
};

export function useWalletBalance() {
  const { user } = useAuth();
  const partyId = user?.canton_party_id;

  const [state, setState] = useState<State>({
    balance: null,
    loading: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!partyId) {
      setState({ balance: null, loading: false, error: null });
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getWalletBalance();
      setState({ balance: data, loading: false, error: null });
    } catch (err) {
      setState({
        balance: null,
        loading: false,
        error: err instanceof ApiError ? err : new ApiError(0, "unknown"),
      });
    }
  }, [partyId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    balance: state.balance,
    loading: state.loading,
    error: state.error,
    isLinked: !!partyId,
    refresh,
  };
}
