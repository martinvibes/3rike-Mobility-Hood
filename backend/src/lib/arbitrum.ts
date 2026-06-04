// Arbitrum One mainnet treasury — holds REAL USDC that backs users' in-app
// (testnet) balances. Used by the Paycrest treasury-bridge: off-ramp sends real
// USDC from here to Paycrest; on-ramp receives real USDC here.

import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  formatUnits,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "../config.js";
import { erc20Abi } from "./abi.js";

export const arbitrumOne = defineChain({
  id: 42161,
  name: "Arbitrum One",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [config.arbitrumRpcUrl] } },
  blockExplorers: { default: { name: "Arbiscan", url: "https://arbiscan.io" } },
});

export const arbPublicClient = createPublicClient({
  chain: arbitrumOne,
  transport: http(config.arbitrumRpcUrl),
});

const treasuryAccount = config.treasuryPrivateKey
  ? privateKeyToAccount(config.treasuryPrivateKey)
  : null;

export const treasuryClient = treasuryAccount
  ? createWalletClient({ account: treasuryAccount, chain: arbitrumOne, transport: http(config.arbitrumRpcUrl) })
  : null;

const USDC_DECIMALS = 6;

export function treasuryConfigured(): boolean {
  return !!(config.treasuryAddress && treasuryClient);
}

/** Real USDC balance of the treasury (human string). */
export async function treasuryUsdcBalance(): Promise<string> {
  if (!config.treasuryAddress) return "0";
  const raw = await arbPublicClient.readContract({
    address: config.arbitrumUsdc,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [config.treasuryAddress],
  });
  return formatUnits(raw, USDC_DECIMALS);
}

/** Send real USDC from the treasury to an address on Arbitrum One. Returns tx hash. */
export async function treasurySendUsdc(to: `0x${string}`, amount: string): Promise<string> {
  if (!treasuryClient) throw new Error("treasury_not_configured");
  const value = parseUnits(amount, USDC_DECIMALS);
  const hash = await treasuryClient.writeContract({
    address: config.arbitrumUsdc,
    abi: erc20Abi,
    functionName: "transfer",
    args: [to, value],
  });
  await arbPublicClient.waitForTransactionReceipt({ hash });
  return hash;
}
