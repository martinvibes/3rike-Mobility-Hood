import "dotenv/config";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:5173,http://localhost:5174")
    .split(",")
    .map((s) => s.trim()),
  jwtSecret: required("JWT_SECRET"),
  encryptionKey: required("ENCRYPTION_KEY"), // 64 hex chars (32 bytes)
  rpcUrl: required("ROBINHOOD_RPC_URL"),
  chainId: Number(process.env.CHAIN_ID ?? 46630),
  usdcAddress: (process.env.USDC_ADDRESS ??
    "0x5B6C7cAF7F99f99154fD8375ec935Fcf03F326f5") as `0x${string}`,
  vaultAddress: (process.env.VAULT_ADDRESS || undefined) as `0x${string}` | undefined,
  relayerPrivateKey: required("RELAYER_PRIVATE_KEY") as `0x${string}`,
};
