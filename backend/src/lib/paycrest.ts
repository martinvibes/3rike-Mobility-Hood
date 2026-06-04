// Paycrest Sender API client (off-ramp confirmed on v1: USDC@arbitrum-one -> NGN).
// Auth: API-Key header. The API Secret is used ONLY to verify webhook HMACs.
// Docs: https://docs.paycrest.io

import crypto from "node:crypto";
import { config } from "../config.js";

async function pc(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(`${config.paycrestBase}${path}`, {
    ...init,
    headers: {
      "API-Key": config.paycrestApiKey,
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string> | undefined),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/** Off-ramp sell rate: how many NGN per 1 USDC (string). */
export async function paycrestRate(
  token: string,
  amount: string,
  fiat: string,
): Promise<string | null> {
  const { ok, data } = await pc(
    `/rates/${token.toLowerCase()}/${amount}/${fiat.toLowerCase()}`,
  );
  return ok ? (data?.data ?? null) : null;
}

/** List supported institutions (bank codes) for a currency, e.g. NGN. */
export async function paycrestInstitutions(currency = "NGN") {
  const { data } = await pc(`/institutions/${currency}`);
  return data?.data ?? [];
}

/**
 * Resolve a bank account name. Non-blocking: returns null if it can't resolve
 * (the order-creation call validates the account anyway).
 */
export async function paycrestVerifyAccount(
  institution: string,
  accountIdentifier: string,
): Promise<string | null> {
  try {
    const { ok, data } = await pc(`/verify-account`, {
      method: "POST",
      body: JSON.stringify({ institution, accountIdentifier }),
    });
    if (!ok) return null;
    const name = data?.data;
    return typeof name === "string" ? name : null;
  } catch {
    return null;
  }
}

export type OfframpOrder = {
  id: string;
  amount: string;
  token: string;
  network: string;
  receiveAddress: `0x${string}`;
  validUntil: string;
  senderFee: string;
  transactionFee: string;
  reference?: string;
};

/**
 * Create an off-ramp order (stablecoin -> fiat). Returns the order incl. the
 * receiveAddress + fees. The caller must then send (amount + senderFee +
 * transactionFee) of the token to receiveAddress before validUntil.
 */
export async function paycrestCreateOfframp(params: {
  amount: string;
  token: string; // USDC
  rate: string;
  network: string; // arbitrum-one
  recipient: {
    institution: string;
    accountIdentifier: string;
    accountName: string;
    memo: string;
    currency: string; // NGN
  };
  reference?: string;
  returnAddress?: string;
}): Promise<OfframpOrder> {
  const { ok, data } = await pc(`/sender/orders`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  if (!ok) {
    const msg =
      data?.data?.message ||
      (Array.isArray(data?.data) ? data.data[0]?.message : undefined) ||
      data?.message ||
      "order_failed";
    throw new Error(typeof msg === "string" ? msg : "order_failed");
  }
  return data.data as OfframpOrder;
}

export async function paycrestGetOrder(id: string) {
  const { data } = await pc(`/sender/orders/${id}`);
  return data?.data;
}

/** Verify a Paycrest webhook signature (HMAC-SHA256 of the raw body with the API Secret). */
export function verifyPaycrestWebhook(rawBody: Buffer, signature: string | undefined): boolean {
  if (!signature || !config.paycrestApiSecret) return false;
  const computed = crypto
    .createHmac("sha256", config.paycrestApiSecret)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
  } catch {
    return false;
  }
}
