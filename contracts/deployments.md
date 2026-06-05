# 3rike — Robinhood Chain Testnet deployments (chain 46630)

| Contract | Address |
|---|---|
| ThreeRikeVault (ERC-4626) | `0x34979dF7570697feB152468C3A17a51d0B9a34ED` |
| USDC (underlying, pre-existing) | `0x5B6C7cAF7F99f99154fD8375ec935Fcf03F326f5` |
| Treasury / relayer (owner) | `0xCc7335908600615cEAC17AB5FA4F779B042847D3` |

Explorer: https://explorer.testnet.chain.robinhood.com/address/0x34979dF7570697feB152468C3A17a51d0B9a34ED

## Investment (fractional ownership) — deployed 2026-06-05
| Contract | Address |
|---|---|
| TricycleNFT (ERC-721) | `0xB590BA8f1319924a29535c9B985E5f5afC80a710` |
| FractionalInvestment (ERC-1155 + accumulator yield) | `0x250f1df17DA6d626BBcDB5B73c079e50B7CA0597` |

2 demo tricycles seeded, pools open at 1 USDC/share:
- RDB-001 Bajaj RE — **$2,500** (2500 shares), **non-EV** (renders as yellow tricycle)
- RDB-002 Mahindra Treo — **$2,800** (2800 shares), **EV**

Rider repayment model: ~$70/wk per tricycle; investor slice $9/$11 per week → ~19/20% APR (derived in `backend/src/lib/catalog.ts`).

**Superseded deploys:** ($3000/3500/4000) NFT `0xB8257851023f16a5f9ab89617719E81B3e8CE958` / Inv `0x61872Ca51536e0394cd6E437037E8232b517C32f`; (3-asset $2000/2500/2800) NFT `0xa715a0ffE746d25C9Cba1CA3b8289C3e116fc55e` / Inv `0xeb90F91688763EC9d1e35e6C63e58a8719d3d525`.
