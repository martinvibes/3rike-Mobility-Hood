// Safe test: creates an off-ramp order (no funds move until treasury sends USDC
// to receiveAddress — we never do that here, so this costs nothing) to confirm
// the rate-tolerance retry now succeeds. Run: tsx scripts/test-offramp-rate.ts
import { paycrestRate, paycrestCreateOfframp } from "../src/lib/paycrest.js";
import { config } from "../src/config.js";

async function main() {
  const amount = "1";
  const rate = await paycrestRate("usdc", amount, "ngn");
  console.log("/rates says:", rate);
  if (!rate) throw new Error("no rate");

  const order = await paycrestCreateOfframp({
    amount,
    token: "USDC",
    rate, // intentionally the (possibly drifted) public rate to trigger the retry
    network: "arbitrum-one",
    recipient: {
      institution: "OPAYNGPC",
      accountIdentifier: "9061793498",
      accountName: "CHINEDU MARTIN MACHIEBE",
      memo: "3rike rate test",
      currency: "NGN",
    },
    reference: `3rike-ratetest-${process.argv[2] ?? "x"}`,
    returnAddress: config.treasuryAddress,
  });
  console.log("ORDER CREATED ✅  id:", order.id, "rateUsed:", order.rate, "receiveAddress:", order.receiveAddress);
  console.log("(order left UNFUNDED — it will expire, no money moved)");
}

main().then(() => process.exit(0)).catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
