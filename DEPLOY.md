# 3rike — Deployment (Railway backend + Vercel frontend)

Both deploy straight from the GitHub repo (`3rike12/3rike-Mobility`). Do the
backend first (you need its URL for the frontend).

---

## 1. Backend → Railway

1. **New Project → Deploy from GitHub repo** → pick `3rike12/3rike-Mobility`.
2. In the service **Settings**:
   - **Root Directory:** `backend`
   - Build/Start are auto-detected from `package.json`:
     - Build: `prisma generate && tsc`
     - Start: `prisma db push --skip-generate && node dist/index.js`  ← applies the schema to Postgres on each deploy
3. **Add Postgres:** in the project, **+ New → Database → PostgreSQL**.
4. **Variables** (service → Variables) — set these:
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (reference the Postgres plugin) |
   | `JWT_SECRET` | `openssl rand -hex 32` |
   | `ENCRYPTION_KEY` | `openssl rand -hex 32` (64 hex chars) |
   | `ROBINHOOD_RPC_URL` | `https://rpc.testnet.chain.robinhood.com` |
   | `CHAIN_ID` | `46630` |
   | `USDC_ADDRESS` | `0x5B6C7cAF7F99f99154fD8375ec935Fcf03F326f5` |
   | `VAULT_ADDRESS` | `0x34979dF7570697feB152468C3A17a51d0B9a34ED` |
   | `TRICYCLE_NFT_ADDRESS` | `0x64b84997414F7Bb301B5e6A2E228066e27C7EDd0` |
   | `INVESTMENT_ADDRESS` | `0xBBE7ECa80d91e26E24A9f498B15239a5D975542B` |
   | `RELAYER_PRIVATE_KEY` | (the relayer key — keep this wallet funded with testnet ETH) |
   | `CORS_ORIGIN` | your Vercel URL (set after step 2; can start with `*` to unblock, then lock down) |
   | `PORT` | `8080` (Railway also injects its own; the app reads `PORT`) |
   | *(optional, bank rails)* | `ARBITRUM_RPC_URL`, `ARBITRUM_USDC`, `TREASURY_ADDRESS`, `TREASURY_PRIVATE_KEY`, `PAYCREST_BASE`, `PAYCREST_API_KEY`, `PAYCREST_API_SECRET` |
5. **Generate a domain:** Settings → Networking → **Generate Domain**. Copy it
   (e.g. `https://3rike-backend.up.railway.app`).
6. Verify: open `https://<backend>/health` → `{"ok":true,"chainId":46630}`.

> ⚠️ Secrets: never commit `.env`. `RELAYER_PRIVATE_KEY` (and `TREASURY_PRIVATE_KEY`)
> are real keys — set them only in Railway Variables. **Rotate the Paycrest secret**
> (it was shared in chat) before using bank rails in production.

---

## 2. Frontend → Vercel

1. **Add New → Project** → import `3rike12/3rike-Mobility`.
2. **Root Directory:** `3rike-frontend`.
3. Framework preset: **Vite** (auto). Build `npm run build`, output `dist`.
   (SPA deep-link routing is handled by `3rike-frontend/vercel.json`.)
4. **Environment Variable:**
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | your Railway backend URL (no trailing slash) |
5. **Deploy.** Copy the resulting URL (e.g. `https://3rike.vercel.app`).

---

## 3. Wire them together
1. Back in **Railway → Variables**, set `CORS_ORIGIN` to the exact Vercel URL
   (comma-separate multiple domains). Redeploy the backend.
2. (Optional, bank rails) Set the Paycrest **webhook URL** to
   `https://<backend>/payments/webhook`.
3. Open the Vercel URL → sign up → confirm balance loads (hits the backend).

---

## Notes
- **Schema sync:** `prisma db push` runs on every backend deploy — safe/idempotent.
  No migration files needed.
- **Local dev now needs Postgres** (provider switched from SQLite). Point local
  `DATABASE_URL` at the Railway Postgres (Connect → Public URL) or a free Neon DB,
  then `npx prisma db push`.
- **Relayer gas:** the hosted app still needs the relayer wallet funded with testnet
  ETH — it sponsors all on-chain actions. Keep `0xCc73…47D3` topped up.
