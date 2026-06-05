// ABIs for the investment stack (TricycleNFT + FractionalInvestment).
// Kept separate from the core token ABIs so each file stays focused.

export const tricycleNftAbi = [
  {
    type: "function",
    name: "nextId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    // Public mapping getter for `meta(uint256)` — returns the struct fields.
    type: "function",
    name: "meta",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "vehicleId", type: "string" },
      { name: "make", type: "string" },
      { name: "model", type: "string" },
      { name: "isEV", type: "bool" },
      { name: "priceUsd", type: "uint256" },
      { name: "rangeKm", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "exists",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export const investmentAbi = [
  {
    // Public mapping getter for `pools(uint256)`.
    type: "function",
    name: "pools",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "pricePerShare", type: "uint256" },
      { name: "totalShares", type: "uint256" },
      { name: "sharesSold", type: "uint256" },
      { name: "accYieldPerShare", type: "uint256" },
      { name: "active", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "pendingYield",
    stateMutability: "view",
    inputs: [
      { name: "tricycleId", type: "uint256" },
      { name: "account", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "invest",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tricycleId", type: "uint256" },
      { name: "shares", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "claimYield",
    stateMutability: "nonpayable",
    inputs: [{ name: "tricycleId", type: "uint256" }],
    outputs: [],
  },
] as const;
