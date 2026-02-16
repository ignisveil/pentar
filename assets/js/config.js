// === EDIT THIS FILE ONLY ===
// Custom swap is powered by Jupiter API + Phantom.
// Replace TOKEN_MINT when your token is ready.

window.PENTAR_CONFIG = {
  name: "pentar",
  symbol: "PENT",
  supply: "1,000,000,000",

  // Optional (if you still want a Buy button link)
  pumpfun_url: "https://pump.fun/",

  // Custom swap defaults
  // Leave empty for now. When ready, paste your token mint.
  token_mint: "",

  // Default input token = SOL (wrapped SOL mint)
  input_mint: "So11111111111111111111111111111111111111112",

  // Default output token placeholder = USDC (safe placeholder so swap works now)
  // You can keep this until your token mint exists.
  output_mint_placeholder: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",

  // Slippage (bps): 50 = 0.5%
  slippage_bps: 50,

  // RPC endpoint for sending tx
  rpc_url: "https://api.mainnet-beta.solana.com",

  // Dexscreener pair (optional)
  dexscreener_pair: "",

  launch_state: "LAUNCHING"
};
