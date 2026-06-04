import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { encrypt } from "../lib/crypto.js";

/**
 * Create a fresh embedded EVM wallet for a new user. The private key is
 * encrypted at rest; the user never sees a seed phrase.
 */
export function createEmbeddedWallet(): { address: `0x${string}`; encryptedKey: string } {
  const pk = generatePrivateKey();
  const account = privateKeyToAccount(pk);
  return { address: account.address, encryptedKey: encrypt(pk) };
}
