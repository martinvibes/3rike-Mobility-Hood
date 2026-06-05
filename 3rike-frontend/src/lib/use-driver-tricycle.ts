// useDriverTricycle: the tricycle assigned to the current driver.
//
// The current (EVM) backend has no driver↔tricycle assignment — the on-chain
// tricycles are *investable assets*, not a driver's own vehicle. Driver
// financing (assignment, weekly repayments, credit score) returns with its own
// backend; until then there's no assigned vehicle to surface, so this resolves
// to null and dependent screens fall back to their placeholders.

import { useCallback, useEffect, useState } from "react";
import { type ApiError, type Tricycle } from "./api";

export function useDriverTricycle() {
  const [tricycle, setTricycle] = useState<Tricycle | null>(null);

  const refresh = useCallback(async () => {
    setTricycle(null);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { tricycle, loading: false, error: null as ApiError | null, refresh };
}
