// Admin/demo helper: distribute USDC yield to a tricycle pool as the platform
// owner (relayer). Mints USDC to the owner if needed, approves, then calls
// distributeYield. Usage: tsx scripts/distribute-yield.ts <tricycleId> <usdc>
import { parseUnits } from "viem";
import { config } from "../src/config.js";
import { erc20Abi } from "../src/lib/abi.js";
import { publicClient, relayer, relayerClient, confirm, explorerTx } from "../src/lib/chain.js";

// Admin-only function — kept out of the app ABI on purpose.
const distributeAbi = [
  {
    type: "function",
    name: "distributeYield",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tricycleId", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

const tricycleId = BigInt(process.argv[2] ?? "1");
const amount = parseUnits(process.argv[3] ?? "10", 6);
const INV = config.investmentAddress;

async function main() {
  // Ensure the owner holds enough USDC (testnet USDC is openly mintable).
  const bal = await publicClient.readContract({
    address: config.usdcAddress, abi: erc20Abi, functionName: "balanceOf", args: [relayer.address],
  });
  if (bal < amount) {
    const m = await relayerClient.writeContract({
      address: config.usdcAddress, abi: erc20Abi, functionName: "mint", args: [relayer.address, amount],
    });
    await confirm(m);
  }
  const a = await relayerClient.writeContract({
    address: config.usdcAddress, abi: erc20Abi, functionName: "approve", args: [INV, amount],
  });
  await confirm(a);
  const d = await relayerClient.writeContract({
    address: INV, abi: distributeAbi, functionName: "distributeYield", args: [tricycleId, amount],
  });
  await confirm(d);
  console.log("distributed", process.argv[3] ?? "10", "USDC to pool", tricycleId.toString());
  console.log(explorerTx(d));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
