'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { MINTS, QuoteOutput } from '@/lib/mints';

type QuoteResponse = any;

function formatCompact(n: number) {
  if (!isFinite(n)) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(2) + 'K';
  return n.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
}

export default function SwapCard() {
  const { connection } = useConnection();
  const { publicKey, connected, sendTransaction } = useWallet();

  const [amountSol, setAmountSol] = useState<string>('');
  const [slippageBps, setSlippageBps] = useState<number>(50);
  const [priority, setPriority] = useState<'auto' | 'none'>('auto');

  const [outputMode, setOutputMode] = useState<QuoteOutput>('USDT');
  const [customMint, setCustomMint] = useState<string>('');

  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [receiveText, setReceiveText] = useState<string>('—');
  const [status, setStatus] = useState<string>('Ready.');
  const [error, setError] = useState<string | null>(null);
  const [loadingQuote, setLoadingQuote] = useState<boolean>(false);
  const [swapping, setSwapping] = useState<boolean>(false);

  const outputMint = useMemo(() => {
    if (outputMode === 'USDT') return MINTS.USDT;
    if (outputMode === 'USDC') return MINTS.USDC;
    return customMint.trim();
  }, [outputMode, customMint]);

  const canQuote = useMemo(() => {
    const v = Number(amountSol);
    if (!amountSol || !isFinite(v) || v <= 0) return false;
    if (outputMode === 'CUSTOM') {
      try {
        // validate mint
        // eslint-disable-next-line no-new
        new PublicKey(outputMint);
      } catch {
        return false;
      }
    }
    return true;
  }, [amountSol, outputMode, outputMint]);

  // Debounced quote
  useEffect(() => {
    let t: any;
    if (!canQuote) {
      setQuote(null);
      setReceiveText('—');
      setError(null);
      return;
    }

    t = setTimeout(async () => {
      try {
        setLoadingQuote(true);
        setError(null);
        setStatus('Fetching quote…');

        const lamports = BigInt(Math.floor(Number(amountSol) * 1e9));
        const url = new URL('/api/jupiter/quote', window.location.origin);
        url.searchParams.set('inputMint', MINTS.SOL);
        url.searchParams.set('outputMint', outputMint);
        url.searchParams.set('amount', lamports.toString());
        url.searchParams.set('slippageBps', String(slippageBps));

        const res = await fetch(url.toString(), { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || 'Quote failed');
        }

        setQuote(json);

        // Jupiter returns outAmount as string in smallest units.
        const outAmount = Number(json?.outAmount || 0);
        // USDT/USDC decimals 6; custom unknown -> show raw with 6 default
        const outDecimals = outputMode === 'CUSTOM' ? 6 : 6;
        const outUi = outAmount / Math.pow(10, outDecimals);
        setReceiveText(formatCompact(outUi));
        setStatus('Quote ready.');
      } catch (e: any) {
        setQuote(null);
        setReceiveText('—');
        setError(e?.message || 'Quote failed');
        setStatus('Quote failed.');
      } finally {
        setLoadingQuote(false);
      }
    }, 450);

    return () => clearTimeout(t);
  }, [amountSol, slippageBps, outputMint, outputMode, canQuote]);

  async function onSwap() {
    if (!publicKey) {
      setError('Connect your wallet first.');
      return;
    }
    if (!quote) {
      setError('No quote available.');
      return;
    }

    try {
      setSwapping(true);
      setError(null);
      setStatus('Preparing swap…');

      // Optional: priority fee support can be added with Jupiter /swap options.
      const res = await fetch('/api/jupiter/swap', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: publicKey.toBase58(),
          // keep room for future options
          priorityFeeMode: priority
        })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || 'Swap build failed');
      }

      const swapTxB64: string | undefined = json?.swapTransaction;
      if (!swapTxB64) throw new Error('Missing swapTransaction from Jupiter');

      const tx = VersionedTransaction.deserialize(Buffer.from(swapTxB64, 'base64'));

      setStatus('Approve in Phantom…');
      const sig = await sendTransaction(tx, connection);
      setStatus('Confirming…');
      await connection.confirmTransaction(sig, 'confirmed');
      setStatus('Swap sent ✅');
    } catch (e: any) {
      setError(e?.message || 'Swap failed');
      setStatus('Swap failed.');
    } finally {
      setSwapping(false);
    }
  }

  return (
    <div className="glass rounded-[28px] p-5 md:p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm font-semibold">PENTAR Swap</div>
          <div className="text-xs text-white/60">Route: {quote?.routePlan ? `${quote.routePlan.length} hops` : '—'}</div>
        </div>

        <div className="flex items-center gap-2">
          <WalletMultiButton className="!rounded-xl !h-10 !bg-gradient-to-r !from-orange-500 !to-yellow-400 !text-black !font-semibold" />
          {connected && (
            <span className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/70">
              {publicKey?.toBase58().slice(0, 4)}…{publicKey?.toBase58().slice(-4)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-4">
          <div className="text-xs tracking-widest uppercase text-white/60">You pay</div>
          <div className="mt-2 flex items-center gap-3">
            <input
              className="input text-lg"
              inputMode="decimal"
              placeholder="0.0"
              value={amountSol}
              onChange={(e) => setAmountSol(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <div className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/80 font-semibold">SOL</div>
          </div>
          <div className="mt-2 text-xs text-white/60">Auto-quote updates while you type.</div>

          <div className="mt-6 text-xs tracking-widest uppercase text-white/60">You receive</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="input text-lg flex items-center">{receiveText}</div>
            <div className="relative">
              <select
                className="input !w-auto"
                value={outputMode}
                onChange={(e) => setOutputMode(e.target.value as QuoteOutput)}
              >
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
                <option value="CUSTOM">CUSTOM</option>
              </select>
            </div>
          </div>

          {outputMode === 'CUSTOM' && (
            <div className="mt-3">
              <div className="text-xs text-white/60">Custom output mint (paste mint address)</div>
              <input
                className="input mt-2"
                placeholder="Mint address…"
                value={customMint}
                onChange={(e) => setCustomMint(e.target.value)}
              />
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs tracking-widest uppercase text-white/60">Slippage</div>
              <select
                className="input mt-2"
                value={slippageBps}
                onChange={(e) => setSlippageBps(Number(e.target.value))}
              >
                <option value={10}>0.10%</option>
                <option value={50}>0.50%</option>
                <option value={100}>1.00%</option>
                <option value={200}>2.00%</option>
              </select>
            </div>
            <div>
              <div className="text-xs tracking-widest uppercase text-white/60">Priority fee</div>
              <select className="input mt-2" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                <option value="auto">Auto</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div className="mt-5 glass rounded-2xl p-4">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Price impact</span>
              <span>{quote?.priceImpactPct ? `${(Number(quote.priceImpactPct) * 100).toFixed(2)}%` : '—'}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-white/70">
              <span>Min received</span>
              <span>{quote?.otherAmountThreshold ? quote.otherAmountThreshold : '—'}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-white/70">
              <span>Estimated fee</span>
              <span>{quote?.platformFee?.amount ? quote.platformFee.amount : '—'}</span>
            </div>
          </div>

          <button
            className="btn btn-primary w-full mt-5 h-12 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!connected || !quote || loadingQuote || swapping}
            onClick={onSwap}
          >
            {swapping ? 'Swapping…' : loadingQuote ? 'Quoting…' : 'Swap'}
          </button>

          <div className="mt-3 text-xs text-white/60">{status}</div>
          {error && <div className="mt-2 text-xs text-red-300">{error}</div>}
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="text-xs tracking-widest uppercase text-white/60">Wallet</div>
          <div className="mt-2 text-sm text-white/80">
            {connected ? 'Connected' : 'Not connected'}
          </div>

          <div className="mt-5 text-xs tracking-widest uppercase text-white/60">Output mint</div>
          <div className="mt-2 text-sm text-white/80 break-all">
            {outputMode === 'USDT' ? 'USDT (default)' : outputMode === 'USDC' ? 'USDC' : outputMint || '—'}
          </div>

          <div className="mt-5 text-xs tracking-widest uppercase text-white/60">Info</div>
          <p className="mt-2 text-sm text-white/70">
            This is a real on-site swap (no iframe). Requires HTTPS deployment (Netlify/Vercel). Phantom recommended.
          </p>

          <div className="mt-5 text-xs tracking-widest uppercase text-white/60">Troubleshooting</div>
          <ul className="mt-2 text-sm text-white/70 list-disc pl-5 space-y-1">
            <li>If quote fails: try smaller amount or switch USDT ↔ USDC.</li>
            <li>Make sure Phantom is unlocked and you are on Solana mainnet.</li>
            <li>If Netlify blocks requests: redeploy and ensure site is HTTPS (not http).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
