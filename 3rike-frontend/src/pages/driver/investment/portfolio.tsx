import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import MobileFrame from "@/components/ui/mobile-frame";
import Skeleton from "@/components/ui/skeleton";
import {
  ApiError,
  getTricycle,
  listInvestments,
  type Fraction,
  type Tricycle,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Row = {
  fraction: Fraction;
  tricycle: Tricycle | null;
};

export default function InvestmentPortfolio() {
  const navigate = useNavigate();
  const { investor } = useAuth();

  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!investor) {
      setRows([]);
      return;
    }
    setError(null);
    (async () => {
      try {
        const fractions = await listInvestments(investor.id);
        // Hydrate each fraction with its tricycle. Failures are non-fatal:
        // the row just shows "Tricycle #N" instead of make/model.
        const hydrated = await Promise.all(
          fractions.map(async (f) => {
            try {
              const tricycle = await getTricycle(f.tricycle_id);
              return { fraction: f, tricycle };
            } catch {
              return { fraction: f, tricycle: null };
            }
          }),
        );
        if (!cancelled) setRows(hydrated);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setRows([]);
        } else {
          setError("Couldn't load your investments. Please try again.");
          setRows([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [investor]);

  const totalUnits = rows?.reduce((sum, r) => sum + r.fraction.units, 0) ?? 0;
  const totalInvested = rows?.reduce(
    (sum, r) => sum + r.fraction.units * r.fraction.price_per_unit,
    0,
  ) ?? 0;

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
        <h1 className="font-semibold text-lg text-gray-900">My Investments</h1>
      </header>

      {/* Summary card */}
      <div className="bg-[#F2FBF5] rounded-2xl p-5 mb-6">
        <p className="text-xs text-[#909090] mb-1">Total invested</p>
        <p className="text-3xl font-bold text-gray-900 mb-3">
          ${totalInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
        <div className="flex items-center justify-between text-xs text-[#909090]">
          <span>
            <span className="font-semibold text-gray-700">{rows?.length ?? 0}</span> tricycles
          </span>
          <span>
            <span className="font-semibold text-gray-700">{totalUnits}</span> total units
          </span>
        </div>
      </div>

      {/* List */}
      {rows === null && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4"
            >
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-3.5 w-16 ml-auto" />
                <Skeleton className="h-2.5 w-12 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      )}

      {rows !== null && rows.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="text-base font-semibold text-gray-700 mb-1">
            No investments yet
          </p>
          <p className="text-xs text-[#909090] mb-6">
            {error ?? "Browse the marketplace and buy your first fraction to start earning weekly yields."}
          </p>
          <Button
            onClick={() => navigate("/driver/investment")}
            className="h-11 px-6 bg-[#01C259] hover:bg-[#00a049] text-white rounded-xl text-sm font-medium cursor-pointer"
          >
            Open marketplace
          </Button>
        </div>
      )}

      {rows !== null && rows.length > 0 && (
        <div className="space-y-3">
          {rows.map(({ fraction, tricycle }) => (
            <div
              key={fraction.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F2FBF5] flex items-center justify-center shrink-0">
                <img
                  src={tricycle?.is_ev ? "/small-tricycle2.svg" : "/small-tricycle.svg"}
                  alt="tricycle"
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {tricycle ? `${tricycle.make} ${tricycle.model}` : `Tricycle #${fraction.tricycle_id}`}
                  {tricycle?.is_ev && <span className="ml-1 text-[10px] text-[#01C259]">EV</span>}
                </p>
                <p className="text-xs text-[#909090]">
                  {fraction.units} {fraction.units === 1 ? "unit" : "units"} · $
                  {fraction.price_per_unit.toLocaleString(undefined, { maximumFractionDigits: 2 })} each
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900">
                  ${(fraction.units * fraction.price_per_unit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-[#909090]">invested</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </MobileFrame>
  );
}
