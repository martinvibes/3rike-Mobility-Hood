import express from "express";
import cors from "cors";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import walletRoutes from "./routes/wallet.js";

const app = express();

app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, chainId: config.chainId });
});

app.use("/auth", authRoutes);
app.use("/wallet", walletRoutes);

app.listen(config.port, () => {
  console.log(`3rike backend listening on :${config.port} (chain ${config.chainId})`);
});
