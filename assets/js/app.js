(() => {
  const cfg = window.PENTAR_CONFIG || {};
  const $ = (s) => document.querySelector(s);

  // Buttons
  const buyLinks = ["#btnBuyTop", "#btnBuyHero", "#btnBuyBottom", "#btnBuyMobile"];
  buyLinks.forEach(id => {
    const el = $(id);
    if (el) el.href = cfg.pumpfun_url || "https://pump.fun/";
  });

  // Text lines
  if ($("#nameLine")) $("#nameLine").textContent = cfg.name || "pentar";
  if ($("#symbolLine")) $("#symbolLine").textContent = cfg.symbol || "PENT";
  if ($("#supplyLine")) $("#supplyLine").textContent = cfg.supply || "1,000,000,000";
  if ($("#supplyLine2")) $("#supplyLine2").textContent = cfg.supply || "1,000,000,000";
  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  if ($("#launchLine")) {
    const state = (cfg.launch_state || "LAUNCHING").toUpperCase();
    $("#launchLine").textContent = state === "LIVE" ? "Now live on pump.fun" : "Launching on pump.fun";
  }

  // Dexscreener embed
  const pair = (cfg.dexscreener_pair || "").trim();
  const pairShort = pair ? (pair.slice(0,4) + "…" + pair.slice(-4)) : "—";
  if ($("#pairShort")) $("#pairShort").textContent = pairShort;

  const dex = $("#dexFrame");
  if (dex) {
    // Dexscreener embed. If you have pair, use it:
    // https://dexscreener.com/solana/{PAIR}?embed=1&theme=dark&info=0
    // If not, default to Solana trending page embed (works as placeholder)
    dex.src = pair
      ? `https://dexscreener.com/solana/${encodeURIComponent(pair)}?embed=1&theme=dark&info=0`
      : "https://dexscreener.com/solana?embed=1&theme=dark";
  }

  // Mobile menu
  const burger = $("#hamburger");
  const mobile = $("#mobileMenu");
  const toggle = (open) => {
    if (!burger || !mobile) return;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    mobile.setAttribute("aria-hidden", open ? "false" : "true");
    mobile.style.display = open ? "block" : "none";
  };
  if (burger && mobile) {
    toggle(false);
    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") !== "true";
      toggle(open);
    });
    mobile.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.matches("a")) toggle(false);
    });
  }

  // Smooth scroll offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 86;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // Cinematic particles (lightweight)
  const canvas = document.getElementById("fx");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let w=0,h=0, dpr=1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = Math.floor(innerWidth * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  };
  resize();
  addEventListener("resize", resize);

  const rand = (a,b) => a + Math.random()*(b-a);
  const dots = Array.from({length: 80}, () => ({
    x: rand(0,w), y: rand(0,h),
    r: rand(0.8, 2.4) * dpr,
    vx: rand(-0.12,0.12) * dpr,
    vy: rand(-0.08,0.08) * dpr,
    a: rand(0.12, 0.45),
    hue: Math.random() < 0.55 ? rand(28, 48) : rand(210, 250) // gold + blue
  }));

  const tick = () => {
    ctx.clearRect(0,0,w,h);

    // soft glow pass
    for (const p of dots) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -50*dpr) p.x = w + 50*dpr;
      if (p.x > w + 50*dpr) p.x = -50*dpr;
      if (p.y < -50*dpr) p.y = h + 50*dpr;
      if (p.y > h + 50*dpr) p.y = -50*dpr;

      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*8);
      g.addColorStop(0, `hsla(${p.hue}, 100%, 65%, ${p.a})`);
      g.addColorStop(1, `hsla(${p.hue}, 100%, 65%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r*8, 0, Math.PI*2);
      ctx.fill();
    }

    // subtle lines
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = "rgba(255,255,255,.18)";
    for (let i=0;i<dots.length;i++){
      for (let j=i+1;j<dots.length;j++){
        const a=dots[i], b=dots[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if (dist < 140*dpr){
          ctx.globalAlpha = (1 - dist/(140*dpr)) * 0.16;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(tick);
  };
  tick();

// ==========================
// Jupiter On‑Site Swap (SOL → USDT)
// ==========================
const JUP_QUOTE_URL = "https://quote-api.jup.ag/v6/quote";
const JUP_SWAP_URL  = "https://quote-api.jup.ag/v6/swap";
const SOL_MINT = "So11111111111111111111111111111111111111112";

const $inAmount = document.getElementById("inAmount");
const $outAmount = document.getElementById("outAmount");
const $outSym = document.getElementById("outSym");
const $swapBtn = document.getElementById("swapBtn");
const $routeLine = document.getElementById("routeLine");
const $statusLine = document.getElementById("statusLine");
const $walletLine = document.getElementById("walletLine");
const $outputMintLine = document.getElementById("outputMintLine");

let currentQuote = null;
let quoteAbort = null;
let quoteTimer = null;

function setStatus(msg) {
  if (window.PENTAR?.setStatus) window.PENTAR.setStatus(msg);
  else if ($statusLine) $statusLine.textContent = msg;
}

function setRoute(msg) {
  if ($routeLine) $routeLine.textContent = msg || "Route: —";
}

function setOut(amountStr) {
  if ($outAmount) $outAmount.textContent = amountStr || "—";
  if ($outSym) $outSym.textContent = (typeof OUTPUT_MINT_LABEL === "string" ? OUTPUT_MINT_LABEL : "USDT");
}

function uiDisableSwap(disabled, label) {
  if (!$swapBtn) return;
  $swapBtn.disabled = !!disabled;
  if (label) $swapBtn.textContent = label;
}

function b64ToU8(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function shortAddr(a) {
  if (!a) return "";
  return a.slice(0, 4) + "…" + a.slice(-4);
}

function getPubkeyStr() {
  const provider = window.PENTAR?.getProvider?.();
  return provider?.publicKey ? provider.publicKey.toString() : null;
}

function readSlippageBps() {
  // UI shows 0.5% by default
  const el = document.getElementById("slippageSel");
  const pct = el ? parseFloat(el.value || "0.5") : 0.5;
  if (!isFinite(pct) || pct <= 0) return 50;
  return Math.round(pct * 100); // 0.5% -> 50 bps
}

function readPriorityFeeMode() {
  const el = document.getElementById("prioSel");
  const v = (el?.value || "auto").toLowerCase();
  return v; // "auto" | "none"
}

async function getSolDecimals(connection) {
  // SOL is 9 decimals
  return 9;
}

async function getTokenDecimals(connection, mint) {
  try {
    // best-effort: on-chain mint account
    const info = await connection.getParsedAccountInfo(new solanaWeb3.PublicKey(mint), "confirmed");
    const parsed = info?.value?.data?.parsed;
    const dec = parsed?.info?.decimals;
    return (typeof dec === "number") ? dec : null;
  } catch {
    return null;
  }
}

function formatUnits(amountIntStr, decimals) {
  // amountIntStr is integer string
  try {
    const s = String(amountIntStr);
    const neg = s.startsWith("-");
    const u = neg ? s.slice(1) : s;
    const d = decimals;
    if (d === 0) return (neg ? "-" : "") + u;
    const pad = u.padStart(d + 1, "0");
    const a = pad.slice(0, -d);
    const b = pad.slice(-d).replace(/0+$/, "");
    return (neg ? "-" : "") + (b ? `${a}.${b}` : a);
  } catch {
    return "—";
  }
}

async function fetchQuote(amountLamports) {
  const outMint = (typeof OUTPUT_MINT_PLACEHOLDER === "string" && OUTPUT_MINT_PLACEHOLDER.length > 0)
    ? OUTPUT_MINT_PLACEHOLDER
    : "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"; // USDT fallback

  const slippageBps = readSlippageBps();
  const url = new URL(JUP_QUOTE_URL);
  url.searchParams.set("inputMint", SOL_MINT);
  url.searchParams.set("outputMint", outMint);
  url.searchParams.set("amount", String(amountLamports));
  url.searchParams.set("slippageBps", String(slippageBps));
  url.searchParams.set("onlyDirectRoutes", "false");
  url.searchParams.set("asLegacyTransaction", "false");

  if (quoteAbort) quoteAbort.abort();
  quoteAbort = new AbortController();

  const res = await fetch(url.toString(), { signal: quoteAbort.signal });
  if (!res.ok) throw new Error(`Quote HTTP ${res.status}`);
  return await res.json();
}

async function updateQuote() {
  const provider = window.PENTAR?.getProvider?.();
  const pubkey = provider?.publicKey;
  if (!$inAmount) return;

  const v = parseFloat($inAmount.value || "0");
  if (!isFinite(v) || v <= 0) {
    currentQuote = null;
    setOut("—");
    setRoute("Route: —");
    uiDisableSwap(true, "Enter amount");
    return;
  }

  // Need wallet connected to quote? not strictly, but UX better
  if (!pubkey) {
    currentQuote = null;
    setOut("—");
    setRoute("Route: —");
    uiDisableSwap(true, "Connect Phantom");
    return;
  }

  try {
    uiDisableSwap(true, "Quoting…");
    setStatus("Fetching quote…");

    const lamports = Math.round(v * 1e9);
    const q = await fetchQuote(lamports);

    if (!q || !q.outAmount) throw new Error("No quote");

    currentQuote = q;

    // decimals for USDT is 6 (fallback), but try to read from chain
    const connection = new solanaWeb3.Connection(SOLANA_RPC, "confirmed");
    const dec = (await getTokenDecimals(connection, q.outputMint)) ?? 6;

    const outUi = formatUnits(q.outAmount, dec);
    setOut(outUi);

    const labels = (q.routePlan || []).map(r => r?.swapInfo?.label).filter(Boolean);
    setRoute(labels.length ? `Route: ${labels.join(" → ")}` : "Route: Jupiter");

    uiDisableSwap(false, "Swap SOL → USDT");
    setStatus("Quote ready.");
  } catch (e) {
    currentQuote = null;
    setOut("—");
    setRoute("Route: —");
    uiDisableSwap(true, "Quote failed");
    setStatus(e?.message ? `Quote failed: ${e.message}` : "Quote failed.");
  }
}

async function doSwap() {
  const provider = window.PENTAR?.getProvider?.();
  if (!provider?.publicKey) {
    setStatus("Connect Phantom first.");
    return;
  }
  if (!currentQuote) {
    setStatus("No quote yet. Enter amount and wait.");
    return;
  }

  uiDisableSwap(true, "Swapping…");
  setStatus("Building swap transaction…");

  try {
    const userPublicKey = provider.publicKey.toString();
    const priorityMode = readPriorityFeeMode();

    const body = {
      quoteResponse: currentQuote,
      userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
    };

    if (priorityMode === "auto") body.prioritizationFeeLamports = "auto";
    if (priorityMode === "none") body.prioritizationFeeLamports = 0;

    const res = await fetch(JUP_SWAP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Swap API HTTP ${res.status}${t ? `: ${t.slice(0, 120)}` : ""}`);
    }
    const json = await res.json();
    const swapTxB64 = json?.swapTransaction;
    if (!swapTxB64) throw new Error("Missing swapTransaction from Jupiter");

    setStatus("Signing transaction in Phantom…");

    const connection = new solanaWeb3.Connection(SOLANA_RPC, "confirmed");
    const tx = solanaWeb3.VersionedTransaction.deserialize(b64ToU8(swapTxB64));

    // Phantom supports signTransaction for VersionedTransaction
    const signedTx = await provider.signTransaction(tx);

    setStatus("Sending transaction…");
    const sig = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: false, maxRetries: 3 });

    setStatus(`Sent: ${shortAddr(sig)} — confirming…`);
    await connection.confirmTransaction(sig, "confirmed");

    setStatus(`✅ Swap confirmed: ${sig}`);
    uiDisableSwap(false, "Swap SOL → USDT");

    // refresh quote after swap (optional)
    setTimeout(() => { updateQuote(); }, 1200);
  } catch (e) {
    setStatus(e?.message ? `Swap failed: ${e.message}` : "Swap failed.");
    uiDisableSwap(false, "Swap SOL → USDT");
  }
}

function wireSwapUI() {
  // Set output mint line once
  if ($outputMintLine) $outputMintLine.textContent = `USDT (default)`;

  // Slippage/priority changes should re-quote
  const slip = document.getElementById("slippageSel");
  const prio = document.getElementById("prioSel");
  slip?.addEventListener("change", () => updateQuote());
  prio?.addEventListener("change", () => updateQuote());

  // Debounced quote on input
  $inAmount?.addEventListener("input", () => {
    if (quoteTimer) clearTimeout(quoteTimer);
    quoteTimer = setTimeout(updateQuote, 350);
  });

  $swapBtn?.addEventListener("click", doSwap);

  // When wallet connects, quote again
  window.addEventListener("pentar:wallet", () => {
    updateQuote();
  });

  // initial state
  uiDisableSwap(true, "Connect Phantom");
  setOut("—");
  setRoute("Route: —");
}

// Wire only if swap UI exists on page
if (document.getElementById("swap") && document.getElementById("swapBtn")) {
  wireSwapUI();
}

})();