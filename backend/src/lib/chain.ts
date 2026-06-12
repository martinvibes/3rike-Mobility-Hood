import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  formatUnits,
  parseEther,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "../config.js";
import { erc20Abi, vaultAbi } from "./abi.js";
import { decrypt } from "./crypto.js";

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

// The Robinhood testnet RPC is slow/rate-limited and intermittently times out,
// so give every transport a generous timeout + automatic retries. Use
// `rpcTransport()` for any wallet client created elsewhere too.
export const rpcTransport = () =>
  http(config.rpcUrl, { timeout: 30_000, retryCount: 4, retryDelay: 1500 });

export const publicClient = createPublicClient({
  chain: robinhoodTestnet,
  transport: rpcTransport(),
});

// Platform relayer/treasury: pays gas + performs settlement mints.
export const relayer = privateKeyToAccount(config.relayerPrivateKey);
export const relayerClient = createWalletClient({
  account: relayer,
  chain: robinhoodTestnet,
  transport: rpcTransport(),
});

const USDC_DECIMALS = 6;

/**
 * Wait for a tx receipt with settings tuned for the Robinhood testnet, whose
 * RPC can be slow/flaky. Without this, viem's default timeout can fire on a tx
 * that actually lands — making a successful write look like a failure (and
 * risking a double-submit on retry).
 */
export function confirm(hash: `0x${string}`) {
  return publicClient.waitForTransactionReceipt({
    hash,
    timeout: 120_000,
    pollingInterval: 2_000,
    retryCount: 10,
  });
}

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
  await confirm(hash);
  return hash;
}

// Gas sponsorship: keep a small ETH float in a user wallet before it signs.
// Gas here is cheap (~0.01 gwei), so a modest top-up covers many txs — keeping
// it small makes the relayer's balance stretch across far more wallets.
const MIN_GAS = parseEther("0.0004");
const TOPUP_GAS = parseEther("0.0008");

/**
 * Withdraw USDC from a user's embedded wallet to an external address. The
 * relayer sponsors gas (tops the wallet up with a little ETH if needed), then
 * the user's own key signs the ERC-20 transfer. Returns the tx hash.
 */
export async function withdrawUsdc(
  encryptedKey: string,
  to: `0x${string}`,
  amount: string,
): Promise<string> {
  const account = privateKeyToAccount(decrypt(encryptedKey) as `0x${string}`);

  // Sponsor gas if the wallet can't cover the transfer.
  const ethBal = await publicClient.getBalance({ address: account.address });
  if (ethBal < MIN_GAS) {
    const fund = await relayerClient.sendTransaction({
      to: account.address,
      value: TOPUP_GAS,
    });
    await confirm(fund);
  }

  const userClient = createWalletClient({
    account,
    chain: robinhoodTestnet,
    transport: rpcTransport(),
  });
  const value = parseUnits(amount, USDC_DECIMALS);
  const hash = await userClient.writeContract({
    address: config.usdcAddress,
    abi: erc20Abi,
    functionName: "transfer",
    args: [to, value],
  });
  await confirm(hash);
  return hash;
}
