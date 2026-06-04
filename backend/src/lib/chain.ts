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
import { erc20Abi, vaultAbi } from "./abi.js";

export const robinhoodTestnet = defineChain({
  id: config.chainId,
  name: "Robinhood Chain Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [config.rpcUrl] } },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://explorer.testnet.chain.robinhood.com",
    },
  },
});

export const publicClient = createPublicClient({
  chain: robinhoodTestnet,
  transport: http(config.rpcUrl),
});

// Platform relayer/treasury: pays gas + performs settlement mints.
export const relayer = privateKeyToAccount(config.relayerPrivateKey);
export const relayerClient = createWalletClient({
  account: relayer,
  chain: robinhoodTestnet,
  transport: http(config.rpcUrl),
});

const USDC_DECIMALS = 6;

export function explorerTx(hash: string): string {
  return `${robinhoodTestnet.blockExplorers.default.url}/tx/${hash}`;
}

export function explorerAddress(address: string): string {
  return `${robinhoodTestnet.blockExplorers.default.url}/address/${address}`;
}

/** Raw USDC balance (smallest unit) of an address. */
export async function usdcBalanceRaw(address: `0x${string}`): Promise<bigint> {
  return publicClient.readContract({
    address: config.usdcAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });
}

/** Human-readable USDC balance string (6dp). */
export async function usdcBalance(address: `0x${string}`): Promise<string> {
  const raw = await usdcBalanceRaw(address);
  return formatUnits(raw, USDC_DECIMALS);
}

/** Value (in USDC) of a user's position in the yield vault, if deployed. */
export async function vaultPositionUsdc(address: `0x${string}`): Promise<string> {
  if (!config.vaultAddress) return "0";
  const raw = await publicClient.readContract({
    address: config.vaultAddress,
    abi: vaultAbi,
    functionName: "maxWithdraw",
    args: [address],
  });
  return formatUnits(raw, USDC_DECIMALS);
}

/**
 * Mint test USDC to an address (Robinhood testnet USDC has an open mint).
 * Used to settle confirmed fiat deposits and for crypto-deposit demos.
 * Returns the tx hash once mined.
 */
export async function mintUsdc(to: `0x${string}`, amount: string): Promise<string> {
  const value = parseUnits(amount, USDC_DECIMALS);
  const hash = await relayerClient.writeContract({
    address: config.usdcAddress,
    abi: erc20Abi,
    functionName: "mint",
    args: [to, value],
  });
  await publicClient.waitForTransactionReceipt({ hash });
  return hash;
}
