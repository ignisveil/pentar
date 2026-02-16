# PENTAR — Next.js PRO Web3 (TypeScript)

## What you get
- Next.js (App Router) + TypeScript
- Tailwind luxury UI
- Phantom connect (Solana Wallet Adapter)
- Real on-site swap (no iframe) using Jupiter v6
  - Default: **SOL → USDT**
  - Optional: switch to **USDC**
  - Later: set **CUSTOM** output mint (paste your token mint)

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Deploy (Netlify / Vercel)
- Must be HTTPS (wallet + Jupiter)
- Set environment variable (optional):
  - `NEXT_PUBLIC_RPC_ENDPOINT` (default: https://api.mainnet-beta.solana.com)

## Notes
- This project uses server routes (`/api/jupiter/*`) to avoid browser CORS issues.
- If quote fails, try smaller amount, or switch USDT ↔ USDC.
