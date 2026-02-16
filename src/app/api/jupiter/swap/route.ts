import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quoteResponse, userPublicKey } = body || {};

    if (!quoteResponse || !userPublicKey) {
      return NextResponse.json({ error: 'Missing quoteResponse or userPublicKey' }, { status: 400 });
    }

    const res = await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
        wrapUnwrapSOL: true,
        asLegacyTransaction: false
      }),
      cache: 'no-store'
    });

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: json?.error || 'Swap API error', details: json }, { status: 502 });
    }

    // returns: swapTransaction (base64), lastValidBlockHeight, etc
    return NextResponse.json(json, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to create swap transaction', details: String(e?.message || e) }, { status: 502 });
  }
}
